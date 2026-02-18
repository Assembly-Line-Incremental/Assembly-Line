import "server-only";
import { createTRPCOptionsProxy, TRPCQueryOptions } from "@trpc/tanstack-react-query";
import { makeQueryClient } from "./query-client";
import { cache } from "react";
import { createCallerFactory, createTRPCContext } from "./init";
import { appRouter } from "./routers/_app";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export const getQueryClient = cache(makeQueryClient);
export const trpc = createTRPCOptionsProxy({
	ctx: createTRPCContext,
	router: appRouter,
	queryClient: getQueryClient,
});

const createCaller = createCallerFactory(appRouter);
export const caller = createCaller(createTRPCContext);

export function HydrateClient(props: { children: React.ReactNode }) {
	const queryClient = getQueryClient();
	return <HydrationBoundary state={dehydrate(queryClient)}>{props.children}</HydrationBoundary>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(queryOptions: T) {
	const queryClient = getQueryClient();
	if (queryOptions.queryKey[1]?.type === "infinite") {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		void queryClient.prefetchInfiniteQuery(queryOptions as any);
	} else {
		void queryClient.prefetchQuery(queryOptions);
	}
}
