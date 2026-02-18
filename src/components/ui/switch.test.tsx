import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Switch } from "./switch";

describe("Switch", () => {
	it("renders a switch", () => {
		render(<Switch aria-label="toggle" />);
		expect(screen.getByRole("switch")).toBeDefined();
	});

	it("applies custom className", () => {
		render(<Switch aria-label="toggle" className="custom" />);
		expect(screen.getByRole("switch").classList.contains("custom")).toBe(true);
	});
});
