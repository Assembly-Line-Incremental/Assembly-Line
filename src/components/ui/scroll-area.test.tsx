import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ScrollArea, ScrollBar } from "./scroll-area";

describe("ScrollArea", () => {
	it("renders children", () => {
		render(
			<ScrollArea>
				<div>Content</div>
			</ScrollArea>
		);
		expect(screen.getByText("Content")).toBeDefined();
	});

	it("applies custom className", () => {
		const { container } = render(
			<ScrollArea className="custom">
				<div>Test</div>
			</ScrollArea>
		);
		expect(container.firstElementChild?.classList.contains("custom")).toBe(true);
	});
});

describe("ScrollBar", () => {
	it("renders with horizontal orientation", () => {
		const { container } = render(
			<ScrollArea>
				<ScrollBar orientation="horizontal" />
				<div>Test</div>
			</ScrollArea>
		);
		expect(container.querySelector("[data-slot='scroll-area-scrollbar']")).toBeDefined();
	});
});
