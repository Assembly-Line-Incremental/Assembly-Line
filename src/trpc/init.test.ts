import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("react", () => ({
	cache: vi.fn((fn: unknown) => fn),
}));

describe("trpc init", () => {
	beforeEach(() => {
		vi.resetModules();
	});

	it("createTRPCContext returns userId", async () => {
		const { createTRPCContext } = await import("./init");
		const ctx = await createTRPCContext();
		expect(ctx).toEqual({ userId: null });
	});

	it("exports createTRPCRouter", async () => {
		const { createTRPCRouter } = await import("./init");
		expect(createTRPCRouter).toBeDefined();
		expect(typeof createTRPCRouter).toBe("function");
	});

	it("exports createCallerFactory", async () => {
		const { createCallerFactory } = await import("./init");
		expect(createCallerFactory).toBeDefined();
		expect(typeof createCallerFactory).toBe("function");
	});

	it("exports baseProcedure", async () => {
		const { baseProcedure } = await import("./init");
		expect(baseProcedure).toBeDefined();
	});

	it("exports protectedProcedure", async () => {
		const { protectedProcedure } = await import("./init");
		expect(protectedProcedure).toBeDefined();
	});

	it("protectedProcedure throws UNAUTHORIZED when session is null", async () => {
		const { createTRPCRouter, protectedProcedure } = await import("./init");
		const { TRPCError } = await import("@trpc/server");

		const router = createTRPCRouter({
			protected: protectedProcedure.query(() => "secret"),
		});

		const caller = router.createCaller({ userId: "user_123" });

		await expect(caller.protected()).rejects.toThrow(
			new TRPCError({
				code: "UNAUTHORIZED",
				message: "You must be logged in to access this resource.",
			})
		);
	});
});
