import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Progress } from "./progress";

describe("Progress", () => {
	it("renders a progressbar", () => {
		const { container } = render(<Progress value={50} />);
		const el = container.querySelector("[role='progressbar']");
		expect(el).toBeDefined();
	});

	it("applies custom className", () => {
		const { container } = render(<Progress value={50} className="custom" />);
		const el = container.querySelector("[role='progressbar']");
		expect(el?.classList.contains("custom")).toBe(true);
	});

	it("handles undefined value (defaults to 0)", () => {
		const { container } = render(<Progress />);
		const indicator = container.querySelector(
			"[data-slot='progress-indicator']"
		) as HTMLElement;
		expect(indicator?.style.transform).toBe("translateX(-100%)");
	});

	it("sets correct transform for given value", () => {
		const { container } = render(<Progress value={75} />);
		const indicator = container.querySelector(
			"[data-slot='progress-indicator']"
		) as HTMLElement;
		expect(indicator?.style.transform).toBe("translateX(-25%)");
	});
});
