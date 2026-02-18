import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ConveyorBelt } from "./conveyor-belt";

describe("ConveyorBelt", () => {
	it("renders with aria-hidden", () => {
		const { container } = render(<ConveyorBelt />);
		const wrapper = container.firstElementChild;
		expect(wrapper?.getAttribute("aria-hidden")).toBe("true");
	});

	it("renders 20 repeated elements", () => {
		const { container } = render(<ConveyorBelt />);
		const items = container.querySelectorAll(".flex.items-center.gap-8");
		expect(items).toHaveLength(20);
	});
});
