import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { prisma, ResourceType } from "@assembly-line/db";
import { SocketGateway } from "../socket/socket.gateway";

interface SaveState {
	userId: string;
	/** Current resource amounts, keyed by ResourceType string */
	amounts: Record<string, number>;
	/** Net production rates (units/sec), keyed by ResourceType string */
	rates: Record<string, number>;
	/** Ticks elapsed since last DB write */
	ticksSinceWrite: number;
}

function safeRecord(value: unknown): Record<string, number> {
	if (typeof value !== "object" || value === null || Array.isArray(value)) return {};
	const result: Record<string, number> = {};
	for (const [k, v] of Object.entries(value)) {
		if (typeof v === "number") result[k] = v;
	}
	return result;
}

function computeRates(
	playerMachines: Array<{
		count: number;
		machine: { baseProduction: unknown; baseConsumption: unknown };
	}>
): Record<string, number> {
	const rates: Record<string, number> = {};
	for (const pm of playerMachines) {
		const prod = safeRecord(pm.machine.baseProduction);
		const cons = safeRecord(pm.machine.baseConsumption);
		for (const [type, val] of Object.entries(prod)) {
			rates[type] = (rates[type] ?? 0) + val * pm.count;
		}
		for (const [type, val] of Object.entries(cons)) {
			rates[type] = (rates[type] ?? 0) - val * pm.count;
		}
	}
	return rates;
}

@Injectable()
export class GameService implements OnModuleInit, OnModuleDestroy {
	/** In-memory state for each active save (online users only) */
	private readonly state = new Map<string, SaveState>();
	private tickInterval?: ReturnType<typeof setInterval>;
	private sessionCleanupInterval?: ReturnType<typeof setInterval>;

	private readonly DB_WRITE_EVERY = 30; // ticks between DB writes (~30s)
	private readonly MAX_OFFLINE_SECONDS = 8 * 60 * 60; // 8h offline catch-up cap

	constructor(private readonly gateway: SocketGateway) {}

	onModuleInit(): void {
		this.tickInterval = setInterval(() => void this.tick(), 1000);
		// RGPD: purge expired sessions every hour
		this.cleanupExpiredSessions().catch((err) =>
			console.error("[GameService] Session cleanup failed:", err)
		);
		this.sessionCleanupInterval = setInterval(
			() =>
				this.cleanupExpiredSessions().catch((err) =>
					console.error("[GameService] Session cleanup failed:", err)
				),
			60 * 60 * 1000
		);
	}

	async onModuleDestroy(): Promise<void> {
		clearInterval(this.tickInterval);
		clearInterval(this.sessionCleanupInterval);
		try {
			await this.flushAll();
		} catch (err) {
			console.error("[GameService] flushAll failed during shutdown:", err);
		}
	}

	private async cleanupExpiredSessions(): Promise<void> {
		await prisma.session.deleteMany({ where: { expiresAt: { lt: new Date() } } });
	}

	private async tick(): Promise<void> {
		const now = Date.now();

		// One query: all ONLINE users with an active save
		const onlineUsers = await prisma.user.findMany({
			where: { presenceStatus: "ONLINE", activeSaveId: { not: null } },
			select: { id: true, activeSaveId: true },
		});

		const onlineSaveIds = new Set(onlineUsers.map((u) => u.activeSaveId!));
		const userIdBySaveId = new Map(onlineUsers.map((u) => [u.activeSaveId!, u.id]));

		// Saves that were in memory but went offline → flush + remove
		const offlineSaveIds = [...this.state.keys()].filter((id) => !onlineSaveIds.has(id));
		if (offlineSaveIds.length > 0) {
			await this.flushSaves(offlineSaveIds, now);
			for (const id of offlineSaveIds) this.state.delete(id);
		}

		// Saves that just came online (not yet in memory) → load from DB + catch-up
		const newSaveIds = [...onlineSaveIds].filter((id) => !this.state.has(id));
		if (newSaveIds.length > 0) {
			await this.loadSaves(newSaveIds, userIdBySaveId, now);
		}

		// Apply one tick to every in-memory save and push via socket.io
		const toFlush: string[] = [];
		for (const [saveId, saveState] of this.state) {
			if (!onlineSaveIds.has(saveId)) continue;

			// Apply 1 second of production (rates are in units/sec)
			for (const [type, rate] of Object.entries(saveState.rates)) {
				saveState.amounts[type] = Math.max(0, (saveState.amounts[type] ?? 0) + rate);
			}
			saveState.ticksSinceWrite++;

			// Push live state via socket.io (in-memory, no DB hit)
			this.gateway.emitToUser(saveState.userId, "game:state", {
				saveId,
				resources: Object.entries(saveState.amounts).map(([type, amount]) => ({
					type: type as ResourceType,
					amount,
					ratePerSecond: saveState.rates[type] ?? 0,
				})),
				tickedAt: now,
			});

			if (saveState.ticksSinceWrite >= this.DB_WRITE_EVERY) {
				toFlush.push(saveId);
			}
		}

		if (toFlush.length > 0) {
			await this.flushSaves(toFlush, now);
			for (const id of toFlush) {
				const s = this.state.get(id);
				if (s) s.ticksSinceWrite = 0;
			}
		}
	}

	/**
	 * Load saves from DB into memory. Applies offline catch-up (capped at 8h)
	 * and writes the result immediately if the offline delta is significant.
	 */
	private async loadSaves(
		saveIds: string[],
		userIdBySaveId: Map<string, string>,
		now: number
	): Promise<void> {
		const saves = await prisma.gameSave.findMany({
			where: { id: { in: saveIds } },
			select: {
				id: true,
				lastTickAt: true,
				resources: { select: { type: true, amount: true } },
				playerMachines: {
					where: { isActive: true, count: { gt: 0 } },
					select: {
						count: true,
						machine: { select: { baseProduction: true, baseConsumption: true } },
					},
				},
			},
		});

		const immediateFlushes: Promise<void>[] = [];

		for (const save of saves) {
			const userId = userIdBySaveId.get(save.id);
			if (!userId) continue;

			const rates = computeRates(save.playerMachines);
			const offlineSeconds = Math.min(
				(now - save.lastTickAt.getTime()) / 1000,
				this.MAX_OFFLINE_SECONDS
			);

			const amounts: Record<string, number> = {};
			for (const r of save.resources) {
				amounts[r.type] = Math.max(
					0,
					Number(r.amount) + (rates[r.type] ?? 0) * offlineSeconds
				);
			}

			this.state.set(save.id, { userId, amounts, rates, ticksSinceWrite: 0 });

			// Persist catch-up immediately so a quick disconnect/reconnect doesn't re-apply it
			if (offlineSeconds > 2) {
				immediateFlushes.push(this.flushSave(save.id, amounts, now));
			}
		}

		if (immediateFlushes.length > 0) {
			await Promise.all(immediateFlushes);
		}
	}

	private async flushSave(
		saveId: string,
		amounts: Record<string, number>,
		now: number
	): Promise<void> {
		await prisma.$transaction([
			...Object.entries(amounts)
				.sort(([a], [b]) => a.localeCompare(b))
				.map(([type, amount]) =>
					prisma.resource.update({
						where: { saveId_type: { saveId, type: type as ResourceType } },
						data: { amount },
					})
				),
			prisma.gameSave.update({
				where: { id: saveId },
				data: { lastTickAt: new Date(now) },
			}),
		]);
	}

	private async flushSaves(saveIds: string[], now: number): Promise<void> {
		await Promise.all(
			saveIds.map((saveId) => {
				const saveState = this.state.get(saveId);
				if (!saveState) return Promise.resolve();
				return this.flushSave(saveId, saveState.amounts, now);
			})
		);
	}

	private async flushAll(): Promise<void> {
		await this.flushSaves([...this.state.keys()], Date.now());
	}

	/** Returns the current in-memory resource amounts, or null if save is not online. */
	getAmounts(saveId: string): Record<string, number> | null {
		return this.state.get(saveId)?.amounts ?? null;
	}

	/** Subtract costs from in-memory amounts (call after a buy transaction). */
	deductAmounts(saveId: string, costs: Record<string, number>): void {
		const saveState = this.state.get(saveId);
		if (!saveState) return;
		for (const [type, cost] of Object.entries(costs)) {
			saveState.amounts[type] = Math.max(0, (saveState.amounts[type] ?? 0) - cost);
		}
	}

	/** Zero out in-memory amounts (call after prestige). */
	resetAmounts(saveId: string): void {
		const saveState = this.state.get(saveId);
		if (!saveState) return;
		for (const key of Object.keys(saveState.amounts)) {
			saveState.amounts[key] = 0;
		}
	}

	/**
	 * Refresh the in-memory rates for a save (call after buy/activate machine).
	 * Rates will be reloaded from DB on the next tick if the save is in memory.
	 */
	async invalidateRates(saveId: string): Promise<void> {
		const saveState = this.state.get(saveId);
		if (!saveState) return;

		const save = await prisma.gameSave.findUnique({
			where: { id: saveId },
			select: {
				playerMachines: {
					where: { isActive: true, count: { gt: 0 } },
					select: {
						count: true,
						machine: { select: { baseProduction: true, baseConsumption: true } },
					},
				},
			},
		});
		if (!save) return;

		saveState.rates = computeRates(save.playerMachines);
	}
}
