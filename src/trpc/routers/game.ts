import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import { prisma } from "@/lib/db";

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
});
