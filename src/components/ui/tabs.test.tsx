import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";

describe("Tabs", () => {
	it("renders tabs with content", () => {
		render(
			<Tabs defaultValue="tab1">
				<TabsList>
					<TabsTrigger value="tab1">Tab 1</TabsTrigger>
					<TabsTrigger value="tab2">Tab 2</TabsTrigger>
				</TabsList>
				<TabsContent value="tab1">Content 1</TabsContent>
				<TabsContent value="tab2">Content 2</TabsContent>
			</Tabs>
		);
		expect(screen.getByRole("tablist")).toBeDefined();
		expect(screen.getAllByRole("tab")).toHaveLength(2);
		expect(screen.getByText("Content 1")).toBeDefined();
	});

	it("applies custom className to tablist", () => {
		render(
			<Tabs defaultValue="a">
				<TabsList className="custom">
					<TabsTrigger value="a">A</TabsTrigger>
				</TabsList>
				<TabsContent value="a">Content</TabsContent>
			</Tabs>
		);
		expect(screen.getByRole("tablist").classList.contains("custom")).toBe(true);
	});
});
