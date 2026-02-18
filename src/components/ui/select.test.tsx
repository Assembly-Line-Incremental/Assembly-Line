import { describe, it, expect, beforeAll, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
	SelectGroup,
	SelectLabel,
	SelectSeparator,
} from "./select";

beforeAll(() => {
	Element.prototype.scrollIntoView = vi.fn();
});

describe("Select", () => {
	it("renders select trigger", () => {
		render(
			<Select>
				<SelectTrigger aria-label="select">
					<SelectValue placeholder="Choose" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>Group</SelectLabel>
						<SelectItem value="a">A</SelectItem>
						<SelectSeparator />
						<SelectItem value="b">B</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
		);
		expect(screen.getByRole("combobox")).toBeDefined();
	});

	it("renders with sm size", () => {
		render(
			<Select>
				<SelectTrigger size="sm" aria-label="select">
					<SelectValue placeholder="Choose" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="a">A</SelectItem>
				</SelectContent>
			</Select>
		);
		expect(screen.getByRole("combobox").getAttribute("data-size")).toBe("sm");
	});

	it("opens and shows items when open", () => {
		render(
			<Select open>
				<SelectTrigger aria-label="select">
					<SelectValue placeholder="Choose" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>Fruits</SelectLabel>
						<SelectItem value="apple">Apple</SelectItem>
						<SelectSeparator />
						<SelectItem value="banana">Banana</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
		);
		expect(screen.getByText("Apple")).toBeDefined();
		expect(screen.getByText("Banana")).toBeDefined();
		expect(screen.getByText("Fruits")).toBeDefined();
	});

	it("renders with popper position", () => {
		render(
			<Select open>
				<SelectTrigger aria-label="select">
					<SelectValue placeholder="Choose" />
				</SelectTrigger>
				<SelectContent position="popper">
					<SelectItem value="a">A</SelectItem>
				</SelectContent>
			</Select>
		);
		expect(screen.getByText("A")).toBeDefined();
	});

	it("applies custom className to trigger", () => {
		render(
			<Select>
				<SelectTrigger aria-label="select" className="custom-trigger">
					<SelectValue placeholder="Choose" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="a">A</SelectItem>
				</SelectContent>
			</Select>
		);
		expect(screen.getByRole("combobox").classList.contains("custom-trigger")).toBe(true);
	});
});
