import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ButtonGroup, ButtonGroupText, ButtonGroupSeparator } from "./button-group";
import { Button } from "./button";

describe("ButtonGroup", () => {
	it("renders buttons in a group", () => {
		render(
			<ButtonGroup>
				<Button>A</Button>
				<Button>B</Button>
			</ButtonGroup>
		);
		expect(screen.getByText("A")).toBeDefined();
		expect(screen.getByText("B")).toBeDefined();
	});

	it("applies custom className", () => {
		const { container } = render(
			<ButtonGroup className="custom">
				<Button>X</Button>
			</ButtonGroup>
		);
		expect(container.firstElementChild?.classList.contains("custom")).toBe(true);
	});
});

describe("ButtonGroupText", () => {
	it("renders text", () => {
		render(
			<ButtonGroup>
				<ButtonGroupText>Label</ButtonGroupText>
			</ButtonGroup>
		);
		expect(screen.getByText("Label")).toBeDefined();
	});

	it("renders as child with asChild", () => {
		render(
			<ButtonGroup>
				<ButtonGroupText asChild>
					<span>AsChild</span>
				</ButtonGroupText>
			</ButtonGroup>
		);
		expect(screen.getByText("AsChild")).toBeDefined();
	});
});

describe("ButtonGroupSeparator", () => {
	it("renders separator with data-slot", () => {
		const { container } = render(
			<ButtonGroup>
				<Button>A</Button>
				<ButtonGroupSeparator />
				<Button>B</Button>
			</ButtonGroup>
		);
		expect(container.querySelector("[data-slot='button-group-separator']")).toBeDefined();
	});
});
