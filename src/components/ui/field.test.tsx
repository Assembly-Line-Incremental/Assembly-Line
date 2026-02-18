import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
	Field,
	FieldLabel,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLegend,
	FieldSeparator,
	FieldSet,
	FieldContent,
	FieldTitle,
} from "./field";

describe("Field", () => {
	it("renders a field group", () => {
		render(
			<Field>
				<FieldLabel>Email</FieldLabel>
			</Field>
		);
		expect(screen.getByText("Email")).toBeDefined();
		expect(screen.getByRole("group")).toBeDefined();
	});

	it("applies orientation data attribute", () => {
		render(
			<Field orientation="horizontal">
				<FieldLabel>Test</FieldLabel>
			</Field>
		);
		expect(screen.getByRole("group").getAttribute("data-orientation")).toBe("horizontal");
	});
});

describe("FieldSet", () => {
	it("renders a fieldset", () => {
		const { container } = render(
			<FieldSet>
				<FieldLegend>Settings</FieldLegend>
			</FieldSet>
		);
		expect(container.querySelector("fieldset")).toBeDefined();
		expect(screen.getByText("Settings")).toBeDefined();
	});
});

describe("FieldGroup", () => {
	it("renders with data-slot", () => {
		const { container } = render(
			<FieldGroup>
				<Field>
					<FieldLabel>A</FieldLabel>
				</Field>
			</FieldGroup>
		);
		expect(container.querySelector("[data-slot='field-group']")).toBeDefined();
	});
});

describe("FieldContent", () => {
	it("renders content wrapper", () => {
		const { container } = render(
			<FieldContent>
				<span>Content</span>
			</FieldContent>
		);
		expect(container.querySelector("[data-slot='field-content']")).toBeDefined();
		expect(screen.getByText("Content")).toBeDefined();
	});
});

describe("FieldTitle", () => {
	it("renders title", () => {
		render(<FieldTitle>Title text</FieldTitle>);
		expect(screen.getByText("Title text")).toBeDefined();
	});
});

describe("FieldDescription", () => {
	it("renders description text", () => {
		render(<FieldDescription>Help text</FieldDescription>);
		expect(screen.getByText("Help text")).toBeDefined();
	});
});

describe("FieldSeparator", () => {
	it("renders separator", () => {
		const { container } = render(<FieldSeparator />);
		expect(container.querySelector("[data-slot='field-separator']")).toBeDefined();
	});

	it("renders separator with text content", () => {
		render(<FieldSeparator>or</FieldSeparator>);
		expect(screen.getByText("or")).toBeDefined();
	});
});

describe("FieldError", () => {
	it("renders nothing when no errors", () => {
		const { container } = render(<FieldError />);
		expect(container.querySelector("[data-slot='field-error']")).toBeNull();
	});

	it("renders error with children", () => {
		render(<FieldError>Something went wrong</FieldError>);
		expect(screen.getByRole("alert")).toBeDefined();
		expect(screen.getByText("Something went wrong")).toBeDefined();
	});

	it("renders single error from errors array", () => {
		render(<FieldError errors={[{ message: "Required" }]} />);
		expect(screen.getByText("Required")).toBeDefined();
	});

	it("renders multiple errors as list", () => {
		render(
			<FieldError errors={[{ message: "Too short" }, { message: "Must contain number" }]} />
		);
		expect(screen.getByText("Too short")).toBeDefined();
		expect(screen.getByText("Must contain number")).toBeDefined();
	});

	it("deduplicates errors with same message", () => {
		render(<FieldError errors={[{ message: "Required" }, { message: "Required" }]} />);
		expect(screen.getByText("Required")).toBeDefined();
	});

	it("renders nothing when errors array is empty", () => {
		const { container } = render(<FieldError errors={[]} />);
		expect(container.querySelector("[data-slot='field-error']")).toBeNull();
	});
});
