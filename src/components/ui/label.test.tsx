import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Label } from "./label";

describe("Label", () => {
	it("renders a label element", () => {
		render(<Label>Test</Label>);
		expect(screen.getByText("Test")).toBeDefined();
	});

	it("applies custom className", () => {
		render(<Label className="custom">Test</Label>);
		expect(screen.getByText("Test").classList.contains("custom")).toBe(true);
	});

	it("has data-slot attribute", () => {
		render(<Label>Test</Label>);
		expect(screen.getByText("Test").getAttribute("data-slot")).toBe("label");
	});
});
