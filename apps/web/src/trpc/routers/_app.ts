import { createTRPCRouter } from "../init";
import { gameRouter } from "./game";
import { machinesRouter } from "./machines";
import { userRouter } from "./user";

export const appRouter = createTRPCRouter({
	game: gameRouter,
	machines: machinesRouter,
	user: userRouter,
});

export type AppRouter = typeof appRouter;
