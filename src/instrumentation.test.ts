import { describe, it, expect, vi, beforeEach } from "vitest";

const mockCaptureRequestError = vi.fn();

vi.mock("@sentry/nextjs", () => ({
	captureRequestError: mockCaptureRequestError,
}));

vi.mock("../sentry.server.config", () => ({}));
vi.mock("../sentry.edge.config", () => ({}));

describe("instrumentation", () => {
	beforeEach(() => {
		vi.resetModules();
	});

	describe("register", () => {
		it("imports sentry.server.config when NEXT_RUNTIME is nodejs", async () => {
			process.env.NEXT_RUNTIME = "nodejs";
			const { register } = await import("./instrumentation");
			await expect(register()).resolves.toBeUndefined();
		});

		it("imports sentry.edge.config when NEXT_RUNTIME is edge", async () => {
			process.env.NEXT_RUNTIME = "edge";
			const { register } = await import("./instrumentation");
			await expect(register()).resolves.toBeUndefined();
		});

		it("does nothing when NEXT_RUNTIME is unset", async () => {
			delete process.env.NEXT_RUNTIME;
			const { register } = await import("./instrumentation");
			await expect(register()).resolves.toBeUndefined();
		});
	});

	describe("onRequestError", () => {
		it("is Sentry.captureRequestError", async () => {
			const { onRequestError } = await import("./instrumentation");
			expect(onRequestError).toBe(mockCaptureRequestError);
		});
	});
});
