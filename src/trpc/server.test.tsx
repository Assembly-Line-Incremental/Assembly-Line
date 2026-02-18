import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render } from "@testing-library/react";

const mockPrefetchQuery = vi.fn();
const mockPrefetchInfiniteQuery = vi.fn();
const mockDehydrate = vi.fn().mockReturnValue({});

vi.mock("server-only", () => ({}));

vi.mock("react", async () => {
	const actual = await vi.importActual<typeof import("react")>("react");
	return {
		...actual,
		cache: vi.fn((fn: unknown) => fn),
	};
});

vi.mock("./query-client", () => ({
	makeQueryClient: vi.fn(() => ({
		prefetchQuery: mockPrefetchQuery,
		prefetchInfiniteQuery: mockPrefetchInfiniteQuery,
		getDefaultOptions: vi.fn(() => ({})),
		setDefaultOptions: vi.fn(),
		getQueryCache: vi.fn(() => ({ subscribe: vi.fn(), getAll: vi.fn(() => []) })),
		getMutationCache: vi.fn(() => ({ subscribe: vi.fn(), getAll: vi.fn(() => []) })),
		mount: vi.fn(),
		unmount: vi.fn(),
	})),
}));

vi.mock("@tanstack/react-query", async () => {
	const actual =
		await vi.importActual<typeof import("@tanstack/react-query")>("@tanstack/react-query");
	return {
		...actual,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		dehydrate: (...args: any[]) => mockDehydrate(...args),
		HydrationBoundary: ({ children }: { children: React.ReactNode }) => <>{children}</>,
	};
});

vi.mock("@trpc/tanstack-react-query", () => ({
	createTRPCOptionsProxy: vi.fn(() => ({})),
	TRPCQueryOptions: vi.fn(),
}));

vi.mock("./init", () => ({
	createTRPCContext: vi.fn(),
	createCallerFactory: vi.fn(() => vi.fn(() => vi.fn())),
}));

vi.mock("./routers/_app", () => ({
	appRouter: {},
}));

describe("trpc server", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("exports getQueryClient", async () => {
		const { getQueryClient } = await import("./server");
		expect(getQueryClient).toBeDefined();
		const client = getQueryClient();
		expect(client).toBeDefined();
	});

	it("exports trpc proxy", async () => {
		const { trpc } = await import("./server");
		expect(trpc).toBeDefined();
	});

	it("exports caller", async () => {
		const { caller } = await import("./server");
		expect(caller).toBeDefined();
	});

	it("HydrateClient renders children and calls dehydrate", async () => {
		const { HydrateClient } = await import("./server");

		const { container } = render(
			<HydrateClient>
				<div>child content</div>
			</HydrateClient>
		);

		expect(container.textContent).toBe("child content");
		expect(mockDehydrate).toHaveBeenCalled();
	});

	it("prefetch calls prefetchQuery for regular queries", async () => {
		const { prefetch } = await import("./server");

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const queryOptions: any = {
			queryKey: ["test", { type: "query" }],
			queryFn: vi.fn(),
		};

		prefetch(queryOptions);
		expect(mockPrefetchQuery).toHaveBeenCalledWith(queryOptions);
		expect(mockPrefetchInfiniteQuery).not.toHaveBeenCalled();
	});

	it("prefetch calls prefetchInfiniteQuery for infinite queries", async () => {
		const { prefetch } = await import("./server");

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const queryOptions: any = {
			queryKey: ["test", { type: "infinite" }],
			queryFn: vi.fn(),
		};

		prefetch(queryOptions);
		expect(mockPrefetchInfiniteQuery).toHaveBeenCalledWith(queryOptions);
		expect(mockPrefetchQuery).not.toHaveBeenCalled();
	});

	it("prefetch calls prefetchQuery when queryKey has no type", async () => {
		const { prefetch } = await import("./server");

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const queryOptions: any = {
			queryKey: ["test"],
			queryFn: vi.fn(),
		};

		prefetch(queryOptions);
		expect(mockPrefetchQuery).toHaveBeenCalledWith(queryOptions);
	});
});
