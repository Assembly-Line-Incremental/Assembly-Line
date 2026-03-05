import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { prisma, ResourceType } from "@assembly-line/db";
import { GameService } from "../game/game.service";
import { SocketGateway } from "../socket/socket.gateway";

function safeRecord(value: unknown): Record<string, number> {
	if (typeof value !== "object" || value === null || Array.isArray(value)) return {};
	const result: Record<string, number> = {};
	for (const [k, v] of Object.entries(value)) {
		if (typeof v === "number") result[k] = v;
	}
	return result;
}

@Injectable()
export class SaveService {
	constructor(
		private readonly gameService: GameService,
		private readonly socketGateway: SocketGateway
	) {}

	// ── Save CRUD ─────────────────────────────────────────────────────────────

	async getSaves(userId: string) {
		const [user, saves, supporter] = await Promise.all([
			prisma.user.findUnique({ where: { id: userId }, select: { activeSaveId: true } }),
			prisma.gameSave.findMany({
				where: { userId },
				orderBy: { slot: "asc" },
				select: {
					id: true,
					slot: true,
					name: true,
					currentEra: true,
					prestigeCount: true,
					updatedAt: true,
				},
			}),
			prisma.supporter.findUnique({ where: { userId }, select: { isActive: true } }),
		]);
		return {
			saves,
			maxSaves: supporter?.isActive ? 3 : 2,
			activeSaveId: user?.activeSaveId ?? null,
		};
	}

	async setActiveSave(userId: string, saveId: string): Promise<void> {
		const save = await prisma.gameSave.findFirst({
			where: { id: saveId, userId },
			select: { id: true },
		});
		if (!save) throw new NotFoundException("Save not found");
		await prisma.user.update({ where: { id: userId }, data: { activeSaveId: saveId } });
		this.socketGateway.emitToUser(userId, "save:changed", { action: "renamed", saveId });
	}

	async createSave(userId: string): Promise<{ id: string }> {
		const result = await prisma.$transaction(async (tx) => {
			const [saveCount, supporter] = await Promise.all([
				tx.gameSave.count({ where: { userId } }),
				tx.supporter.findUnique({ where: { userId }, select: { isActive: true } }),
			]);

			const maxSaves = supporter?.isActive ? 3 : 2;
			if (saveCount >= maxSaves) throw new ForbiddenException("Save limit reached");

			const usedSlots = await tx.gameSave.findMany({
				where: { userId },
				select: { slot: true },
			});
			const usedSet = new Set(usedSlots.map((s) => s.slot));
			let slot = 1;
			while (usedSet.has(slot)) slot++;

			const save = await tx.gameSave.create({
				data: { userId, slot, name: `Factory ${slot}` },
			});
			await tx.resource.createMany({
				data: Object.values(ResourceType).map((type) => ({ saveId: save.id, type })),
				skipDuplicates: true,
			});
			await tx.user.update({ where: { id: userId }, data: { activeSaveId: save.id } });
			return { id: save.id };
		});

		this.socketGateway.emitToUser(userId, "save:changed", {
			action: "created",
			saveId: result.id,
		});
		return result;
	}

	async deleteSave(userId: string, saveId: string): Promise<void> {
		const deletedCount = await prisma.$transaction(async (tx) => {
			const count = await tx.gameSave.count({ where: { userId } });
			if (count <= 1) throw new BadRequestException("Cannot delete the last save");
			const result = await tx.gameSave.deleteMany({ where: { id: saveId, userId } });
			return result.count;
		});
		if (deletedCount === 0) throw new NotFoundException("Save not found");
		this.socketGateway.emitToUser(userId, "save:changed", { action: "deleted", saveId });
	}

	async renameSave(userId: string, saveId: string, name: string): Promise<void> {
		const { count } = await prisma.gameSave.updateMany({
			where: { id: saveId, userId },
			data: { name },
		});
		if (count === 0) throw new NotFoundException("Save not found");
		this.socketGateway.emitToUser(userId, "save:changed", { action: "renamed", saveId, name });
	}

	// ── Resources ─────────────────────────────────────────────────────────────

	async getResources(userId: string, saveId: string) {
		const save = await prisma.gameSave.findFirst({
			where: { id: saveId, userId },
			select: {
				resources: { select: { type: true, amount: true, totalProduced: true } },
				playerMachines: {
					where: { isActive: true, count: { gt: 0 } },
					select: {
						count: true,
						machine: { select: { baseProduction: true, baseConsumption: true } },
					},
				},
			},
		});
		if (!save) return [];

		const rates: Partial<Record<string, number>> = {};
		for (const pm of save.playerMachines) {
			const prod = safeRecord(pm.machine.baseProduction);
			const cons = safeRecord(pm.machine.baseConsumption);
			for (const [type, val] of Object.entries(prod))
				rates[type] = (rates[type] ?? 0) + val * pm.count;
			for (const [type, val] of Object.entries(cons))
				rates[type] = (rates[type] ?? 0) - val * pm.count;
		}

		return save.resources.map((r) => ({
			type: r.type,
			amount: Number(r.amount),
			totalProduced: Number(r.totalProduced),
			productionRate: rates[r.type] ?? 0,
		}));
	}

	// ── Machines ──────────────────────────────────────────────────────────────

	async getMachines(userId: string, saveId: string) {
		const save = await prisma.gameSave.findFirst({
			where: { id: saveId, userId },
			select: { currentEra: true },
		});
		if (!save) throw new NotFoundException("Save not found");

		const [definitions, playerMachines] = await Promise.all([
			prisma.machineDefinition.findMany({
				where: { era: { lte: save.currentEra } },
				orderBy: [{ era: "asc" }, { name: "asc" }],
			}),
			prisma.playerMachine.findMany({
				where: { saveId },
				select: { machineId: true, count: true, level: true, isActive: true },
			}),
		]);

		const pmByMachineId = new Map(playerMachines.map((pm) => [pm.machineId, pm]));
		return definitions.map((d) => ({
			id: d.id,
			slug: d.slug,
			name: d.name,
			era: d.era,
			baseCost: safeRecord(d.baseCost),
			costMultiplier: Number(d.costMultiplier),
			baseProduction: safeRecord(d.baseProduction),
			baseConsumption: safeRecord(d.baseConsumption),
			baseHeat: Number(d.baseHeat),
			maxLevel: d.maxLevel,
			playerMachine: pmByMachineId.get(d.id) ?? null,
		}));
	}

	// ── Machine actions ───────────────────────────────────────────────────────

	/**
	 * Buy `count` machines for a save.
	 * Calculates the cumulative cost (baseCost * multiplier^i), verifies affordability
	 * from in-memory state (or DB fallback), runs a transaction, then syncs memory.
	 */
	async buyMachine(
		userId: string,
		saveId: string,
		machineId: string,
		count: number
	): Promise<{ count: number; isActive: boolean }> {
		// Ownership check
		const save = await prisma.gameSave.findFirst({
			where: { id: saveId, userId },
			select: { id: true },
		});
		if (!save) throw new NotFoundException("Save not found");

		// Load machine definition
		const def = await prisma.machineDefinition.findUnique({
			where: { id: machineId },
			select: { baseCost: true, costMultiplier: true, maxLevel: true },
		});
		if (!def) throw new NotFoundException("Machine definition not found");

		// Current owned count
		const existing = await prisma.playerMachine.findUnique({
			where: { saveId_machineId: { saveId, machineId } },
			select: { count: true },
		});
		const owned = existing?.count ?? 0;

		// Cumulative cost: sum of baseCost * multiplier^(owned+i) for i in [0, count)
		const baseCost = safeRecord(def.baseCost);
		const multiplier = Number(def.costMultiplier);
		const costs: Record<string, number> = {};
		for (const [type, base] of Object.entries(baseCost)) {
			let total = 0;
			for (let i = 0; i < count; i++) {
				total += base * Math.pow(multiplier, owned + i);
			}
			costs[type] = total;
		}

		// Affordability check — in-memory if online, DB otherwise
		const memAmounts = this.gameService.getAmounts(saveId);
		if (memAmounts) {
			for (const [type, cost] of Object.entries(costs)) {
				if ((memAmounts[type] ?? 0) < cost) {
					throw new BadRequestException(`Insufficient ${type}`);
				}
			}
		} else {
			const resources = await prisma.resource.findMany({
				where: { saveId, type: { in: Object.keys(costs) as ResourceType[] } },
				select: { type: true, amount: true },
			});
			const byType = new Map(resources.map((r) => [r.type, Number(r.amount)]));
			for (const [type, cost] of Object.entries(costs)) {
				if ((byType.get(type as ResourceType) ?? 0) < cost) {
					throw new BadRequestException(`Insufficient ${type}`);
				}
			}
		}

		// Transaction: deduct resources + upsert PlayerMachine
		const pm = await prisma.$transaction(async (tx) => {
			await Promise.all(
				Object.entries(costs).map(([type, cost]) =>
					tx.resource.update({
						where: { saveId_type: { saveId, type: type as ResourceType } },
						data: { amount: { decrement: cost } },
					})
				)
			);
			return tx.playerMachine.upsert({
				where: { saveId_machineId: { saveId, machineId } },
				create: { saveId, machineId, count, isActive: true },
				update: { count: { increment: count } },
				select: { count: true, isActive: true },
			});
		});

		// Sync in-memory state
		this.gameService.deductAmounts(saveId, costs);
		await this.gameService.invalidateRates(saveId);

		return pm;
	}

	/**
	 * Toggle a machine's active state for a save.
	 */
	async setMachineActive(
		userId: string,
		saveId: string,
		machineId: string,
		isActive: boolean
	): Promise<void> {
		const save = await prisma.gameSave.findFirst({
			where: { id: saveId, userId },
			select: { id: true },
		});
		if (!save) throw new NotFoundException("Save not found");

		const { count } = await prisma.playerMachine.updateMany({
			where: { saveId, machineId },
			data: { isActive },
		});
		if (count === 0) throw new NotFoundException("Machine not found in this save");

		await this.gameService.invalidateRates(saveId);
	}

	/**
	 * Prestige a save: award prestige points (√totalProduced METAL), reset
	 * resource amounts to 0, increment prestigeCount.
	 */
	async prestige(userId: string, saveId: string): Promise<{ prestigePoints: number }> {
		const save = await prisma.gameSave.findFirst({
			where: { id: saveId, userId },
			select: { id: true, prestigeCount: true },
		});
		if (!save) throw new NotFoundException("Save not found");

		// Compute awarded prestige points from total METAL produced
		const metal = await prisma.resource.findUnique({
			where: { saveId_type: { saveId, type: "METAL" } },
			select: { totalProduced: true },
		});
		const prestigePoints = Math.max(
			1,
			Math.floor(Math.sqrt(Number(metal?.totalProduced ?? 0)))
		);

		await prisma.$transaction([
			// Reset all resource amounts (keep totalProduced / totalSpent for stats)
			prisma.resource.updateMany({ where: { saveId }, data: { amount: 0 } }),
			// Increment save prestige counter + reset tick
			prisma.gameSave.update({
				where: { id: saveId },
				data: { prestigeCount: { increment: 1 }, lastTickAt: new Date() },
			}),
			// Upsert PrestigeState
			prisma.prestigeState.upsert({
				where: { saveId },
				create: {
					saveId,
					prestigePoints,
					totalEarned: prestigePoints,
					timesPrestiged: 1,
					lastPrestigeAt: new Date(),
				},
				update: {
					prestigePoints: { increment: prestigePoints },
					totalEarned: { increment: prestigePoints },
					timesPrestiged: { increment: 1 },
					lastPrestigeAt: new Date(),
				},
			}),
		]);

		// Sync in-memory amounts to 0
		this.gameService.resetAmounts(saveId);

		return { prestigePoints };
	}
}
