import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import { prisma } from "@/lib/db";
import { PresenceStatus } from "@/generated/prisma/client";

export const gameRouter = createTRPCRouter({
	/**
	 * All game saves for the current user, ordered by slot.
	 */
	saves: protectedProcedure.query(async ({ ctx }) => {
		return prisma.gameSave.findMany({
			where: { userId: ctx.auth.user.id },
			orderBy: { slot: "asc" },
			select: {
				id: true,
				slot: true,
				name: true,
				currentEra: true,
				prestigeCount: true,
				updatedAt: true,
			},
		});
	}),

	/**
	 * Resources for a specific game save.
	 * Polled at ~1 Hz by the resource header.
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
				},
			});

			if (!save) return [];

			return save.resources.map((r) => ({
				type: r.type,
				amount: Number(r.amount),
				totalProduced: Number(r.totalProduced),
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
});
