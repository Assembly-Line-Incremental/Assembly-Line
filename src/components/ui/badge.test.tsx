import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./badge";

describe("Badge", () => {
	it("renders with default variant", () => {
		render(<Badge>Default</Badge>);
		expect(screen.getByText("Default")).toBeDefined();
	});

	it("renders with asChild", () => {
		render(
			<Badge asChild>
				<a href="#">Link Badge</a>
			</Badge>
		);
		expect(screen.getByText("Link Badge").tagName).toBe("A");
	});

	it("applies custom className", () => {
		const { container } = render(<Badge className="custom">X</Badge>);
		expect(container.querySelector("[data-slot='badge']")?.classList.contains("custom")).toBe(
			true
		);
	});
});
