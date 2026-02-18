import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFetchRequestHandler = vi.fn();

vi.mock("@trpc/server/adapters/fetch", () => ({
	fetchRequestHandler: mockFetchRequestHandler,
}));

vi.mock("@/trpc/init", () => ({
	createTRPCContext: vi.fn(),
}));

vi.mock("@/trpc/routers/_app", () => ({
	appRouter: { _def: {} },
}));

describe("tRPC route handler", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("exports GET handler", async () => {
		const { GET } = await import("./route");
		expect(GET).toBeDefined();
		expect(typeof GET).toBe("function");
	});

	it("exports POST handler", async () => {
		const { POST } = await import("./route");
		expect(POST).toBeDefined();
		expect(typeof POST).toBe("function");
	});

	it("GET calls fetchRequestHandler with correct config", async () => {
		const { GET } = await import("./route");
		const { createTRPCContext } = await import("@/trpc/init");
		const { appRouter } = await import("@/trpc/routers/_app");

		const mockReq = new Request("http://localhost/api/trpc/test");
		await GET(mockReq);

		expect(mockFetchRequestHandler).toHaveBeenCalledWith({
			endpoint: "/api/trpc",
			req: mockReq,
			router: appRouter,
			createContext: createTRPCContext,
		});
	});

	it("POST calls fetchRequestHandler with correct config", async () => {
		const { POST } = await import("./route");
		const { createTRPCContext } = await import("@/trpc/init");
		const { appRouter } = await import("@/trpc/routers/_app");

		const mockReq = new Request("http://localhost/api/trpc/test", {
			method: "POST",
		});
		await POST(mockReq);

		expect(mockFetchRequestHandler).toHaveBeenCalledWith({
			endpoint: "/api/trpc",
			req: mockReq,
			router: appRouter,
			createContext: createTRPCContext,
		});
	});

	it("GET and POST reference the same handler function", async () => {
		const { GET, POST } = await import("./route");
		expect(GET).toBe(POST);
	});

	it("returns the result of fetchRequestHandler", async () => {
		const mockResponse = new Response("ok");
		mockFetchRequestHandler.mockResolvedValueOnce(mockResponse);

		const { GET } = await import("./route");
		const mockReq = new Request("http://localhost/api/trpc/test");
		const result = await GET(mockReq);

		expect(result).toBe(mockResponse);
	});
});
