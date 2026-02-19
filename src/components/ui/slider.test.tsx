import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { Slider } from "./slider";

beforeAll(() => {
	vi.stubGlobal(
		"ResizeObserver",
		class {
			observe = vi.fn();
			unobserve = vi.fn();
			disconnect = vi.fn();
		}
	);
});

describe("Slider", () => {
	it("renders a slider", () => {
		render(<Slider aria-label="slider" defaultValue={[50]} />);
		expect(screen.getByRole("slider")).toBeDefined();
	});

	it("applies custom className", () => {
		const { container } = render(
			<Slider aria-label="slider" defaultValue={[50]} className="custom" />
		);
		expect(container.firstElementChild?.classList.contains("custom")).toBe(true);
	});

	it("renders with controlled value", () => {
		render(<Slider aria-label="slider" value={[30]} />);
		expect(screen.getByRole("slider")).toBeDefined();
	});

	it("renders with no value and no defaultValue (uses min/max)", () => {
		const { container } = render(<Slider aria-label="slider" />);
		const thumbs = container.querySelectorAll("[data-slot='slider-thumb']");
		expect(thumbs.length).toBe(2);
	});
});
