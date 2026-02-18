import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Textarea } from "./textarea";

describe("Textarea", () => {
	it("renders a textarea element", () => {
		render(<Textarea data-testid="textarea" />);
		expect(screen.getByTestId("textarea").tagName).toBe("TEXTAREA");
	});

	it("applies custom className", () => {
		render(<Textarea data-testid="textarea" className="custom" />);
		expect(screen.getByTestId("textarea").classList.contains("custom")).toBe(true);
	});

	it("has data-slot attribute", () => {
		render(<Textarea data-testid="textarea" />);
		expect(screen.getByTestId("textarea").getAttribute("data-slot")).toBe("textarea");
	});
});
