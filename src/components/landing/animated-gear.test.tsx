import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { AnimatedGear } from "./animated-gear";

describe("AnimatedGear", () => {
	it("renders an SVG element", () => {
		const { container } = render(<AnimatedGear />);
		const svg = container.querySelector("svg");
		expect(svg).toBeDefined();
	});

	it("has aria-hidden attribute", () => {
		const { container } = render(<AnimatedGear />);
		const svg = container.querySelector("svg");
		expect(svg?.getAttribute("aria-hidden")).toBe("true");
	});

	it("applies custom size", () => {
		const { container } = render(<AnimatedGear size={120} />);
		const svg = container.querySelector("svg");
		expect(svg?.getAttribute("width")).toBe("120");
		expect(svg?.getAttribute("height")).toBe("120");
	});

	it("uses default size of 80", () => {
		const { container } = render(<AnimatedGear />);
		const svg = container.querySelector("svg");
		expect(svg?.getAttribute("width")).toBe("80");
		expect(svg?.getAttribute("height")).toBe("80");
	});

	it("renders gear path with correct color", () => {
		const { container } = render(<AnimatedGear color="#FF0000" />);
		const path = container.querySelector("path");
		expect(path?.getAttribute("fill")).toBe("#FF0000");
	});

	it("renders inner ring circle with correct stroke color", () => {
		const { container } = render(<AnimatedGear color="#FF0000" />);
		const circles = container.querySelectorAll("circle");
		const ring = circles[0];
		expect(ring?.getAttribute("stroke")).toBe("#FF0000");
	});

	it("renders center hole circle", () => {
		const { container } = render(<AnimatedGear />);
		const circles = container.querySelectorAll("circle");
		expect(circles.length).toBeGreaterThanOrEqual(2);
	});

	it("applies custom className", () => {
		const { container } = render(<AnimatedGear className="test-class" />);
		const svg = container.querySelector("svg");
		expect(svg?.classList.contains("test-class")).toBe(true);
	});

	it("uses spin-slow animation by default", () => {
		const { container } = render(<AnimatedGear />);
		const g = container.querySelector("g");
		expect(g?.style.animation).toContain("spin-slow");
		expect(g?.style.animation).not.toContain("reverse");
	});

	it("uses spin-slow-reverse animation when reverse is true", () => {
		const { container } = render(<AnimatedGear reverse={true} />);
		const g = container.querySelector("g");
		expect(g?.style.animation).toContain("spin-slow-reverse");
	});

	it("applies custom duration", () => {
		const { container } = render(<AnimatedGear duration={10} />);
		const g = container.querySelector("g");
		expect(g?.style.animation).toContain("10s");
	});
});
