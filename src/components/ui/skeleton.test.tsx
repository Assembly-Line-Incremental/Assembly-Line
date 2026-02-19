import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Skeleton } from "./skeleton";

describe("Skeleton", () => {
	it("renders a div element", () => {
		const { container } = render(<Skeleton />);
		expect(container.firstElementChild?.tagName).toBe("DIV");
	});

	it("applies custom className", () => {
		const { container } = render(<Skeleton className="custom" />);
		expect(container.firstElementChild?.classList.contains("custom")).toBe(true);
	});

	it("has data-slot attribute", () => {
		const { container } = render(<Skeleton />);
		expect(container.firstElementChild?.getAttribute("data-slot")).toBe("skeleton");
	});

	it("has animate-pulse class", () => {
		const { container } = render(<Skeleton />);
		expect(container.firstElementChild?.classList.contains("animate-pulse")).toBe(true);
	});
});
