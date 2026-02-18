import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuCheckboxItem,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSub,
	DropdownMenuSubTrigger,
	DropdownMenuSubContent,
	DropdownMenuPortal,
} from "./dropdown-menu";

describe("DropdownMenu", () => {
	it("renders trigger", () => {
		render(
			<DropdownMenu>
				<DropdownMenuTrigger>Open</DropdownMenuTrigger>
			</DropdownMenu>
		);
		expect(screen.getByText("Open")).toBeDefined();
	});

	it("renders content when open", () => {
		render(
			<DropdownMenu open>
				<DropdownMenuTrigger>Open</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuGroup>
						<DropdownMenuLabel>Label</DropdownMenuLabel>
						<DropdownMenuItem>Item 1</DropdownMenuItem>
						<DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
						<DropdownMenuItem inset>Inset</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuItem>
						Item 2 <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		);
		expect(screen.getByText("Item 1")).toBeDefined();
		expect(screen.getByText("Label")).toBeDefined();
		expect(screen.getByText("Delete")).toBeDefined();
		expect(screen.getByText("Inset")).toBeDefined();
		expect(screen.getByText("⌘K")).toBeDefined();
	});

	it("renders checkbox items when open", () => {
		render(
			<DropdownMenu open>
				<DropdownMenuTrigger>Open</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuCheckboxItem checked={true}>Checked</DropdownMenuCheckboxItem>
					<DropdownMenuCheckboxItem checked={false}>Unchecked</DropdownMenuCheckboxItem>
				</DropdownMenuContent>
			</DropdownMenu>
		);
		expect(screen.getByText("Checked")).toBeDefined();
		expect(screen.getByText("Unchecked")).toBeDefined();
	});

	it("renders radio items when open", () => {
		render(
			<DropdownMenu open>
				<DropdownMenuTrigger>Open</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuRadioGroup value="a">
						<DropdownMenuRadioItem value="a">Option A</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="b">Option B</DropdownMenuRadioItem>
					</DropdownMenuRadioGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		);
		expect(screen.getByText("Option A")).toBeDefined();
	});

	it("renders sub menus when open", () => {
		render(
			<DropdownMenu open>
				<DropdownMenuTrigger>Open</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent>
								<DropdownMenuItem>Sub Item</DropdownMenuItem>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>
					<DropdownMenuSub>
						<DropdownMenuSubTrigger inset>Inset Sub</DropdownMenuSubTrigger>
						<DropdownMenuSubContent>
							<DropdownMenuItem>Sub Item 2</DropdownMenuItem>
						</DropdownMenuSubContent>
					</DropdownMenuSub>
				</DropdownMenuContent>
			</DropdownMenu>
		);
		expect(screen.getByText("More")).toBeDefined();
	});

	it("renders label with inset when open", () => {
		render(
			<DropdownMenu open>
				<DropdownMenuTrigger>Open</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuLabel inset>Inset Label</DropdownMenuLabel>
				</DropdownMenuContent>
			</DropdownMenu>
		);
		expect(screen.getByText("Inset Label")).toBeDefined();
	});
});
