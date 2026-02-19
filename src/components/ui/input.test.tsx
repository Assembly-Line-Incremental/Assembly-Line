import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Input } from "./input";

describe("Input", () => {
	it("renders an input element", () => {
		render(<Input data-testid="input" />);
		expect(screen.getByTestId("input")).toBeDefined();
	});

	it("applies custom className", () => {
		render(<Input data-testid="input" className="custom" />);
		expect(screen.getByTestId("input").classList.contains("custom")).toBe(true);
	});

	it("forwards type prop", () => {
		render(<Input data-testid="input" type="email" />);
		expect(screen.getByTestId("input").getAttribute("type")).toBe("email");
	});

	it("has data-slot attribute", () => {
		render(<Input data-testid="input" />);
		expect(screen.getByTestId("input").getAttribute("data-slot")).toBe("input");
	});
});
