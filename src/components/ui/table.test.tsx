import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
	TableFooter,
	TableCaption,
} from "./table";

describe("Table", () => {
	it("renders a table with content", () => {
		render(
			<Table>
				<TableCaption>Test caption</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow>
						<TableCell>Value</TableCell>
					</TableRow>
				</TableBody>
				<TableFooter>
					<TableRow>
						<TableCell>Footer</TableCell>
					</TableRow>
				</TableFooter>
			</Table>
		);
		expect(screen.getByRole("table")).toBeDefined();
		expect(screen.getByText("Name")).toBeDefined();
		expect(screen.getByText("Value")).toBeDefined();
		expect(screen.getByText("Footer")).toBeDefined();
		expect(screen.getByText("Test caption")).toBeDefined();
	});

	it("applies custom className", () => {
		render(
			<Table className="custom">
				<TableBody>
					<TableRow>
						<TableCell>X</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		);
		expect(screen.getByRole("table").classList.contains("custom")).toBe(true);
	});
});
