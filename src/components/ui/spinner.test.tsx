import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Spinner } from "./spinner";

describe("Spinner", () => {
	it("renders with accessible label", () => {
		render(<Spinner />);
		expect(screen.getByLabelText("Loading")).toBeDefined();
	});

	it("applies custom className", () => {
		const { container } = render(<Spinner className="custom" />);
		expect(container.firstElementChild?.classList.contains("custom")).toBe(true);
	});
});
