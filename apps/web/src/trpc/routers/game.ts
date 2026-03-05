import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import { apiFetch } from "@/lib/api-server";
import type { SaveInfo } from "@/types";

type SavesResponse = { saves: SaveInfo[]; maxSaves: number; activeSaveId: string | null };
type ResourceEntry = {
	type: string;
	amount: number;
	totalProduced: number;
	productionRate: number;
};

export const gameRouter = createTRPCRouter({
	/**
	 * All game saves for the current user, ordered by slot.
	 * Also returns maxSaves based on supporter status (2 base, +1 for active supporters).
	 */
	saves: protectedProcedure.query(({ ctx }) =>
		apiFetch<SavesResponse>("/save", ctx.auth.user.id)
	),

	/**
	 * Set the active save for the current user (synced across all devices).
	 */
	setActiveSave: protectedProcedure
		.input(z.object({ saveId: z.string() }))
		.mutation(({ ctx, input }) =>
			apiFetch("/save/set-active", ctx.auth.user.id, {
				method: "POST",
				body: JSON.stringify({ saveId: input.saveId }),
			})
		),

	/**
	 * Resources for a specific game save, with production rates.
	 */
	resources: protectedProcedure
		.input(z.object({ saveId: z.string() }))
		.query(({ ctx, input }) =>
			apiFetch<ResourceEntry[]>(`/save/${input.saveId}/resources`, ctx.auth.user.id)
		),

	/**
	 * Create a new save slot (max 2 for regular users, 3 for active supporters).
	 */
	createSave: protectedProcedure.mutation(({ ctx }) =>
		apiFetch<{ id: string }>("/save", ctx.auth.user.id, { method: "POST" })
	),

	/**
	 * Delete a save slot. Requires at least one save to remain.
	 */
	deleteSave: protectedProcedure
		.input(z.object({ saveId: z.string() }))
		.mutation(({ ctx, input }) =>
			apiFetch(`/save/${input.saveId}`, ctx.auth.user.id, { method: "DELETE" })
		),

	/**
	 * Rename a save slot.
	 */
	renameSave: protectedProcedure
		.input(z.object({ saveId: z.string(), name: z.string().trim().min(1).max(32) }))
		.mutation(({ ctx, input }) =>
			apiFetch(`/save/${input.saveId}/name`, ctx.auth.user.id, {
				method: "PATCH",
				body: JSON.stringify({ name: input.name }),
			})
		),
});
