import { expect, it, describe } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home", () => {
	it("renders the heading", () => {
		render(<Home />);

		expect(screen.getByRole("heading", { level: 1, name: /To get started/i })).toBeDefined();
	});
});
