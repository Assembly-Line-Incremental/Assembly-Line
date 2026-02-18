import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Checkbox } from "./checkbox";

describe("Checkbox", () => {
	it("renders a checkbox", () => {
		render(<Checkbox aria-label="test" />);
		expect(screen.getByRole("checkbox")).toBeDefined();
	});

	it("applies custom className", () => {
		render(<Checkbox aria-label="test" className="custom" />);
		expect(screen.getByRole("checkbox").classList.contains("custom")).toBe(true);
	});
});
