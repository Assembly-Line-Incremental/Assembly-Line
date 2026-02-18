import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Kbd, KbdGroup } from "./kbd";

describe("Kbd", () => {
	it("renders kbd element with text", () => {
		render(<Kbd>Ctrl</Kbd>);
		expect(screen.getByText("Ctrl")).toBeDefined();
		expect(screen.getByText("Ctrl").tagName).toBe("KBD");
	});

	it("applies custom className", () => {
		render(<Kbd className="custom">K</Kbd>);
		expect(screen.getByText("K").classList.contains("custom")).toBe(true);
	});
});

describe("KbdGroup", () => {
	it("renders children", () => {
		render(
			<KbdGroup>
				<Kbd>Ctrl</Kbd>
			</KbdGroup>
		);
		expect(screen.getByText("Ctrl")).toBeDefined();
	});
});
