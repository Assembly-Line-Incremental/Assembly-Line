import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { Toaster } from "./sonner";

vi.mock("next-themes", () => ({
	useTheme: () => ({ theme: "dark" }),
}));

describe("Toaster", () => {
	it("renders without error", () => {
		const { container } = render(<Toaster />);
		expect(container).toBeDefined();
	});
});
