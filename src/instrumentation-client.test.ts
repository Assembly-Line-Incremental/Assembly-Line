import { describe, it, expect, vi } from "vitest";

const { mockInit, mockReplayIntegration, mockCaptureRouterTransitionStart } = vi.hoisted(() => ({
	mockInit: vi.fn(),
	mockReplayIntegration: vi.fn().mockReturnValue({ name: "Replay" }),
	mockCaptureRouterTransitionStart: vi.fn(),
}));

vi.mock("@sentry/nextjs", () => ({
	init: mockInit,
	replayIntegration: mockReplayIntegration,
	captureRouterTransitionStart: mockCaptureRouterTransitionStart,
}));

vi.stubEnv("SKIP_ENV_VALIDATION", "1");
vi.stubEnv("NEXT_PUBLIC_SENTRY_DSN", "https://fake-dsn@o0.ingest.sentry.io/0");

const { onRouterTransitionStart } = await import("./instrumentation-client");

describe("instrumentation-client", () => {
	describe("Sentry.init", () => {
		it("is called once on module load", () => {
			expect(mockInit).toHaveBeenCalledOnce();
		});

		it("is called with the correct DSN", () => {
			expect(mockInit).toHaveBeenCalledWith(
				expect.objectContaining({
					dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
				})
			);
		});

		it("is called with tracesSampleRate of 1", () => {
			expect(mockInit).toHaveBeenCalledWith(expect.objectContaining({ tracesSampleRate: 1 }));
		});

		it("is called with replaysSessionSampleRate of 0.1", () => {
			expect(mockInit).toHaveBeenCalledWith(
				expect.objectContaining({ replaysSessionSampleRate: 0.1 })
			);
		});

		it("is called with replaysOnErrorSampleRate of 1.0", () => {
			expect(mockInit).toHaveBeenCalledWith(
				expect.objectContaining({ replaysOnErrorSampleRate: 1.0 })
			);
		});

		it("is called with sendDefaultPii enabled", () => {
			expect(mockInit).toHaveBeenCalledWith(
				expect.objectContaining({ sendDefaultPii: true })
			);
		});

		it("is called with enableLogs enabled", () => {
			expect(mockInit).toHaveBeenCalledWith(expect.objectContaining({ enableLogs: true }));
		});

		it("includes the replay integration", () => {
			expect(mockReplayIntegration).toHaveBeenCalledOnce();
			expect(mockInit).toHaveBeenCalledWith(
				expect.objectContaining({
					integrations: expect.arrayContaining([{ name: "Replay" }]),
				})
			);
		});
	});

	describe("onRouterTransitionStart", () => {
		it("is Sentry.captureRouterTransitionStart", () => {
			expect(onRouterTransitionStart).toBe(mockCaptureRouterTransitionStart);
		});
	});
});
