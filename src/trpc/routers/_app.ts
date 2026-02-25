import { createTRPCRouter } from "../init";
import { gameRouter } from "./game";

export const appRouter = createTRPCRouter({
	game: gameRouter,
});

export type AppRouter = typeof appRouter;
