import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RadioGroup, RadioGroupItem } from "./radio-group";

describe("RadioGroup", () => {
	it("renders a radiogroup", () => {
		render(
			<RadioGroup defaultValue="a">
				<RadioGroupItem value="a" aria-label="Option A" />
				<RadioGroupItem value="b" aria-label="Option B" />
			</RadioGroup>
		);
		expect(screen.getByRole("radiogroup")).toBeDefined();
		expect(screen.getAllByRole("radio")).toHaveLength(2);
	});

	it("applies custom className", () => {
		render(
			<RadioGroup className="custom" defaultValue="a">
				<RadioGroupItem value="a" aria-label="A" />
			</RadioGroup>
		);
		expect(screen.getByRole("radiogroup").classList.contains("custom")).toBe(true);
	});
});
