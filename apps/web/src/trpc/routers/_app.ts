import { createTRPCRouter } from "../init";
import { gameRouter } from "./game";
import { machinesRouter } from "./machines";

export const appRouter = createTRPCRouter({
	game: gameRouter,
	machines: machinesRouter,
});

export type AppRouter = typeof appRouter;
