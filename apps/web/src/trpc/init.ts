import { auth } from "@/lib/auth";
import { initTRPC, TRPCError } from "@trpc/server";
import { headers } from "next/headers";
import { cache } from "react";
import superjson from "superjson";

interface Context {
	userId: string | null;
}

export const createTRPCContext = cache(async (): Promise<Context> => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	return { userId: session?.user?.id ?? null };
});

const t = initTRPC.context<Context>().create({
	transformer: superjson,
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "You must be logged in to access this resource.",
		});
	}

	return next({
		ctx: { ...ctx, auth: session },
	});
});
