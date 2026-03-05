import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../init";
import { prisma } from "@/lib/db";
import { pgNotify } from "@/lib/pg-notify";
import { PresenceStatus, ResourceType } from "@/generated/prisma/client";

export const gameRouter = createTRPCRouter({
	/**
	 * All game saves for the current user, ordered by slot.
	 * Also returns maxSaves based on supporter status (2 base, +1 for active supporters).
	 */
	saves: protectedProcedure.query(async ({ ctx }) => {
		const userId = ctx.auth.user.id;
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
			prisma.supporter.findUnique({
				where: { userId },
				select: { isActive: true },
			}),
		]);
		return {
			saves,
			maxSaves: supporter?.isActive ? 3 : 2,
			activeSaveId: user?.activeSaveId ?? null,
		};
	}),

	/**
	 * Set the active save for the current user (synced across all devices).
	 */
	setActiveSave: protectedProcedure
		.input(z.object({ saveId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.auth.user.id;
			// Verify the save belongs to this user
			const save = await prisma.gameSave.findFirst({
				where: { id: input.saveId, userId },
				select: { id: true },
			});
			if (!save) throw new TRPCError({ code: "NOT_FOUND", message: "Save not found" });
			await prisma.user.update({
				where: { id: userId },
				data: { activeSaveId: input.saveId },
			});
			void pgNotify(userId);
		}),

	/**
	 * Resources for a specific game save, with production rates.
	 * Rates are computed from active PlayerMachines so the client can interpolate
	 * without waiting for a second poll.
	 */
	resources: protectedProcedure
		.input(z.object({ saveId: z.string() }))
		.query(async ({ ctx, input }) => {
			const save = await prisma.gameSave.findFirst({
				where: { id: input.saveId, userId: ctx.auth.user.id },
				select: {
					resources: {
						select: { type: true, amount: true, totalProduced: true },
					},
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

			function safeRecord(value: unknown): Record<string, number> {
				if (typeof value !== "object" || value === null || Array.isArray(value)) return {};
				const result: Record<string, number> = {};
				for (const [k, v] of Object.entries(value)) {
					if (typeof v === "number") result[k] = v;
				}
				return result;
			}

			// Compute net production rate (units/sec) per resource type
			const rates: Partial<Record<string, number>> = {};
			for (const pm of save.playerMachines) {
				const prod = safeRecord(pm.machine.baseProduction);
				const cons = safeRecord(pm.machine.baseConsumption);
				for (const [type, val] of Object.entries(prod)) {
					rates[type] = (rates[type] ?? 0) + val * pm.count;
				}
				for (const [type, val] of Object.entries(cons)) {
					rates[type] = (rates[type] ?? 0) - val * pm.count;
				}
			}

			return save.resources.map((r) => ({
				type: r.type,
				amount: Number(r.amount),
				totalProduced: Number(r.totalProduced),
				productionRate: rates[r.type] ?? 0,
			}));
		}),

	// ── Presence ────────────────────────────────────────────────────────────

	/**
	 * Called every ~30 s while the player is active.
	 * Marks the user ONLINE and refreshes lastSeenAt.
	 */
	heartbeat: protectedProcedure.mutation(async ({ ctx }) => {
		const now = new Date();
		const minIntervalMs = 20_000;
		await prisma.user.updateMany({
			where: {
				id: ctx.auth.user.id,
				OR: [
					{ lastSeenAt: null },
					{ lastSeenAt: { lt: new Date(now.getTime() - minIntervalMs) } },
				],
			},
			data: { presenceStatus: PresenceStatus.ONLINE, lastSeenAt: now },
		});
	}),

	/**
	 * Called after 10 min of inactivity (no mouse/keyboard events).
	 * Marks the user IDLE without updating lastSeenAt.
	 */
	setIdle: protectedProcedure.mutation(async ({ ctx }) => {
		await prisma.user.updateMany({
			where: { id: ctx.auth.user.id },
			data: { presenceStatus: PresenceStatus.IDLE },
		});
	}),

	/**
	 * Called on beforeunload / page hide.
	 * Marks the user OFFLINE so the server can skip their tick.
	 */
	setOffline: protectedProcedure.mutation(async ({ ctx }) => {
		await prisma.user.updateMany({
			where: { id: ctx.auth.user.id },
			data: { presenceStatus: PresenceStatus.OFFLINE, lastSeenAt: new Date() },
		});
	}),

	/**
	 * Create a new save slot (max 2 for regular users, 3 for active supporters).
	 * Finds the smallest unused slot number and seeds all resource types.
	 */
	createSave: protectedProcedure.mutation(async ({ ctx }) => {
		const userId = ctx.auth.user.id;

		return prisma
			.$transaction(async (tx) => {
				const [saveCount, supporter] = await Promise.all([
					tx.gameSave.count({ where: { userId } }),
					tx.supporter.findUnique({ where: { userId }, select: { isActive: true } }),
				]);

				const maxSaves = supporter?.isActive ? 3 : 2;
				if (saveCount >= maxSaves) {
					throw new TRPCError({ code: "FORBIDDEN", message: "Save limit reached" });
				}

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
			})
			.then((result) => {
				void pgNotify(userId);
				return result;
			});
	}),

	/**
	 * Delete a save slot. Requires at least one save to remain.
	 * Cascades to all related records (resources, machines, etc.).
	 */
	deleteSave: protectedProcedure
		.input(z.object({ saveId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.auth.user.id;
			const deletedCount = await prisma.$transaction(async (tx) => {
				const count = await tx.gameSave.count({ where: { userId } });
				if (count <= 1) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "Cannot delete the last save",
					});
				}
				const result = await tx.gameSave.deleteMany({
					where: { id: input.saveId, userId },
				});
				return result.count;
			});
			if (deletedCount === 0) {
				throw new TRPCError({ code: "NOT_FOUND", message: "Save not found" });
			}
			void pgNotify(userId);
		}),

	/**
	 * Rename a save slot.
	 */
	renameSave: protectedProcedure
		.input(z.object({ saveId: z.string(), name: z.string().trim().min(1).max(32) }))
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.auth.user.id;
			const { count } = await prisma.gameSave.updateMany({
				where: { id: input.saveId, userId },
				data: { name: input.name },
			});
			if (count === 0) {
				throw new TRPCError({ code: "NOT_FOUND", message: "Save not found" });
			}
			void pgNotify(userId);
		}),
});
