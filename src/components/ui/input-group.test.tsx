import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupText,
	InputGroupInput,
	InputGroupTextarea,
} from "./input-group";

describe("InputGroup", () => {
	it("renders input group with role", () => {
		render(
			<InputGroup>
				<InputGroupInput data-testid="input" />
			</InputGroup>
		);
		expect(screen.getByRole("group")).toBeDefined();
	});

	it("applies custom className", () => {
		render(
			<InputGroup className="custom">
				<InputGroupInput />
			</InputGroup>
		);
		expect(screen.getByRole("group").classList.contains("custom")).toBe(true);
	});
});

describe("InputGroupAddon", () => {
	it("renders addon with default alignment", () => {
		const { container } = render(
			<InputGroup>
				<InputGroupAddon>$</InputGroupAddon>
				<InputGroupInput />
			</InputGroup>
		);
		expect(container.querySelector("[data-slot='input-group-addon']")).toBeDefined();
	});

	it("supports inline-end alignment", () => {
		const { container } = render(
			<InputGroup>
				<InputGroupInput />
				<InputGroupAddon align="inline-end">.00</InputGroupAddon>
			</InputGroup>
		);
		const addon = container.querySelector("[data-slot='input-group-addon']");
		expect(addon?.getAttribute("data-align")).toBe("inline-end");
	});

	it("focuses input when addon is clicked (not on button)", () => {
		const focusSpy = vi.fn();
		const { container } = render(
			<InputGroup>
				<InputGroupAddon>$</InputGroupAddon>
				<InputGroupInput onFocus={focusSpy} />
			</InputGroup>
		);
		const addon = container.querySelector("[data-slot='input-group-addon']") as HTMLElement;
		fireEvent.click(addon);
		expect(focusSpy).toHaveBeenCalled();
	});

	it("does not focus input when button inside addon is clicked", () => {
		const focusSpy = vi.fn();
		const { container } = render(
			<InputGroup>
				<InputGroupAddon>
					<InputGroupButton>Go</InputGroupButton>
				</InputGroupAddon>
				<InputGroupInput onFocus={focusSpy} />
			</InputGroup>
		);
		const button = screen.getByText("Go");
		fireEvent.click(button);
		expect(focusSpy).not.toHaveBeenCalled();
	});
});

describe("InputGroupButton", () => {
	it("renders a button", () => {
		render(
			<InputGroup>
				<InputGroupInput />
				<InputGroupAddon>
					<InputGroupButton>Go</InputGroupButton>
				</InputGroupAddon>
			</InputGroup>
		);
		expect(screen.getByText("Go")).toBeDefined();
	});
});

describe("InputGroupText", () => {
	it("renders text content", () => {
		render(
			<InputGroup>
				<InputGroupAddon>
					<InputGroupText>Label</InputGroupText>
				</InputGroupAddon>
				<InputGroupInput />
			</InputGroup>
		);
		expect(screen.getByText("Label")).toBeDefined();
	});
});

describe("InputGroupTextarea", () => {
	it("renders textarea inside group", () => {
		const { container } = render(
			<InputGroup>
				<InputGroupTextarea data-testid="textarea" />
			</InputGroup>
		);
		expect(container.querySelector("textarea")).toBeDefined();
	});
});
