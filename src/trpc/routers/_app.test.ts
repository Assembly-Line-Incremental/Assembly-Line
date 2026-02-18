import { describe, it, expect, vi } from "vitest";

vi.mock("react", () => ({
	cache: vi.fn((fn: unknown) => fn),
}));

describe("appRouter", () => {
	it("exports appRouter", async () => {
		const { appRouter } = await import("./_app");
		expect(appRouter).toBeDefined();
	});

	it("appRouter is a valid tRPC router", async () => {
		const { appRouter } = await import("./_app");
		expect(appRouter._def).toBeDefined();
		expect(appRouter._def.procedures).toBeDefined();
	});

	it("appRouter has no procedures defined yet", async () => {
		const { appRouter } = await import("./_app");
		expect(Object.keys(appRouter._def.procedures)).toHaveLength(0);
	});

	it("appRouter has createCaller method", async () => {
		const { appRouter } = await import("./_app");
		expect(typeof appRouter.createCaller).toBe("function");
	});
});
