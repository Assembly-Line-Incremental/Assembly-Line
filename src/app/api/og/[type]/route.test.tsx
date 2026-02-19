import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockNotFound } = vi.hoisted(() => ({
	mockNotFound: vi.fn(() => {
		throw new Error("NEXT_NOT_FOUND");
	}),
}));

vi.mock("next/navigation", () => ({
	notFound: mockNotFound,
}));

vi.mock("next/og", () => ({
	ImageResponse: class MockImageResponse {
		readonly status = 200;
		constructor(
			public readonly element: unknown,
			public readonly options: unknown
		) {}
	},
}));

const makeParams = (type: string) =>
	({ params: Promise.resolve({ type }) }) as { params: Promise<{ type: string }> };

describe("GET /api/og/[type]", () => {
	beforeEach(() => {
		mockNotFound.mockClear();
	});

	describe("valid types", () => {
		it.each(["default", "game", "leaderboard"] as const)(
			"returns an ImageResponse for type=%s",
			async (type) => {
				const { GET } = await import("./route");
				const res = await GET(new Request("https://example.com"), makeParams(type));
				expect(res).toBeDefined();
				expect(res.status).toBe(200);
				expect(mockNotFound).not.toHaveBeenCalled();
			}
		);
	});

	describe("invalid type", () => {
		it("calls notFound() for an unknown type", async () => {
			const { GET } = await import("./route");
			await expect(
				GET(new Request("https://example.com"), makeParams("hacked"))
			).rejects.toThrow("NEXT_NOT_FOUND");
			expect(mockNotFound).toHaveBeenCalledOnce();
		});

		it("calls notFound() for an empty string", async () => {
			const { GET } = await import("./route");
			await expect(GET(new Request("https://example.com"), makeParams(""))).rejects.toThrow(
				"NEXT_NOT_FOUND"
			);
			expect(mockNotFound).toHaveBeenCalledOnce();
		});
	});
});
