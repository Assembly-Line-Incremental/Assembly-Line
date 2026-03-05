import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import { apiFetch } from "@/lib/api-server";

export const machinesRouter = createTRPCRouter({
	/**
	 * All machine definitions available for the save's current era,
	 * merged with the player's current counts/levels/active state.
	 */
	list: protectedProcedure
		.input(z.object({ saveId: z.string() }))
		.query(({ ctx, input }) => apiFetch(`/save/${input.saveId}/machines`, ctx.auth.user.id)),
});
