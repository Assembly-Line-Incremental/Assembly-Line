import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Play from "./page";

describe("Play", () => {
	it("renders the play page", () => {
		render(<Play />);
		expect(screen.getByText("Play")).toBeDefined();
	});
});
