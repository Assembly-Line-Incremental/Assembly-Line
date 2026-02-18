import { initTRPC, TRPCError } from "@trpc/server";
import { cache } from "react";
import superjson from "superjson";

interface Context {
	userId: string | null;
}

export const createTRPCContext = cache(async (): Promise<Context> => {
	// TODO: populate userId from authenticated session once auth is implemented
	return { userId: null };
});

const t = initTRPC.context<Context>().create({
	transformer: superjson,
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
	// TODO: get session from auth api
	const session = null;

	/* istanbul ignore next -- @preserve TODO: unreachable until auth is implemented */
	if (session) {
		return next({
			ctx: { ...ctx, auth: session },
		});
	}

	throw new TRPCError({
		code: "UNAUTHORIZED",
		message: "You must be logged in to access this resource.",
	});
});
