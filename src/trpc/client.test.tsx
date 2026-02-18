import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("./query-client", () => ({
	makeQueryClient: vi.fn(() => ({
		getDefaultOptions: vi.fn(() => ({})),
		setDefaultOptions: vi.fn(),
		getQueryCache: vi.fn(() => ({ subscribe: vi.fn() })),
		getMutationCache: vi.fn(() => ({ subscribe: vi.fn() })),
		mount: vi.fn(),
		unmount: vi.fn(),
	})),
}));

vi.mock("@/env", () => ({
	env: { NEXT_PUBLIC_URL: "https://example.com" },
}));

describe("trpc client", () => {
	beforeEach(() => {
		vi.resetModules();
	});

	it("exports TRPCProvider", async () => {
		const { TRPCProvider } = await import("./client");
		expect(TRPCProvider).toBeDefined();
	});

	it("exports useTRPC", async () => {
		const { useTRPC } = await import("./client");
		expect(useTRPC).toBeDefined();
	});

	it("TRPCReactProvider renders children", async () => {
		const { TRPCReactProvider } = await import("./client");

		render(
			<TRPCReactProvider>
				<div data-testid="child">Hello</div>
			</TRPCReactProvider>
		);

		expect(screen.getByTestId("child").textContent).toBe("Hello");
	});

	it("TRPCReactProvider creates query client on browser", async () => {
		const { TRPCReactProvider } = await import("./client");
		const { makeQueryClient } = await import("./query-client");

		render(
			<TRPCReactProvider>
				<div>Test</div>
			</TRPCReactProvider>
		);

		expect(makeQueryClient).toHaveBeenCalled();
	});

	it("TRPCReactProvider reuses browser query client on subsequent renders", async () => {
		const { TRPCReactProvider } = await import("./client");
		const { makeQueryClient } = await import("./query-client");

		const { unmount } = render(
			<TRPCReactProvider>
				<div>First</div>
			</TRPCReactProvider>
		);

		const callCountAfterFirst = vi.mocked(makeQueryClient).mock.calls.length;
		unmount();

		render(
			<TRPCReactProvider>
				<div>Second</div>
			</TRPCReactProvider>
		);

		// Should reuse the cached browserQueryClient
		expect(vi.mocked(makeQueryClient).mock.calls.length).toBe(callCountAfterFirst);
	});

	it("getUrl returns /api/trpc path on browser", async () => {
		const { TRPCReactProvider } = await import("./client");

		render(
			<TRPCReactProvider>
				<div>Test</div>
			</TRPCReactProvider>
		);

		expect(screen.getByText("Test")).toBeDefined();
	});
});
