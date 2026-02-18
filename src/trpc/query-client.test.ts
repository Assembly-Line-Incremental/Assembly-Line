import { describe, it, expect } from "vitest";
import { makeQueryClient } from "./query-client";

describe("makeQueryClient", () => {
	it("returns a QueryClient instance", () => {
		const client = makeQueryClient();
		expect(client).toBeDefined();
	});

	it("sets staleTime to 30 seconds", () => {
		const client = makeQueryClient();
		const defaults = client.getDefaultOptions();
		expect(defaults.queries?.staleTime).toBe(30_000);
	});

	it("provides serializeData using superjson", () => {
		const client = makeQueryClient();
		const defaults = client.getDefaultOptions();
		const serializeData = defaults.dehydrate?.serializeData;
		expect(serializeData).toBeDefined();

		const date = new Date("2024-01-01");
		const serialized = serializeData!(date);
		expect(serialized).toBeDefined();
	});

	it("provides deserializeData using superjson", () => {
		const client = makeQueryClient();
		const defaults = client.getDefaultOptions();
		const deserializeData = defaults.hydrate?.deserializeData;
		expect(deserializeData).toBeDefined();
	});

	it("shouldDehydrateQuery returns true for success queries", () => {
		const client = makeQueryClient();
		const defaults = client.getDefaultOptions();
		const shouldDehydrate = defaults.dehydrate?.shouldDehydrateQuery;
		expect(shouldDehydrate).toBeDefined();

		const successQuery = {
			state: { status: "success" },
			queryKey: ["test"],
			queryHash: '["test"]',
			gcTime: 300_000,
		};

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		expect(shouldDehydrate!(successQuery as any)).toBe(true);
	});

	it("shouldDehydrateQuery calls the function for pending queries", () => {
		const client = makeQueryClient();
		const defaults = client.getDefaultOptions();
		const shouldDehydrate = defaults.dehydrate?.shouldDehydrateQuery;

		const pendingQuery = {
			state: { status: "pending" },
			queryKey: ["test"],
			queryHash: '["test"]',
			gcTime: 300_000,
		};

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const result = shouldDehydrate!(pendingQuery as any);
		expect(typeof result).toBe("boolean");
	});
});
