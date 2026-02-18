import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardAction,
	CardContent,
	CardFooter,
} from "./card";

describe("Card", () => {
	it("renders card with content", () => {
		render(
			<Card>
				<CardHeader>
					<CardTitle>Title</CardTitle>
					<CardDescription>Description</CardDescription>
					<CardAction>Action</CardAction>
				</CardHeader>
				<CardContent>Content</CardContent>
				<CardFooter>Footer</CardFooter>
			</Card>
		);
		expect(screen.getByText("Title")).toBeDefined();
		expect(screen.getByText("Description")).toBeDefined();
		expect(screen.getByText("Action")).toBeDefined();
		expect(screen.getByText("Content")).toBeDefined();
		expect(screen.getByText("Footer")).toBeDefined();
	});

	it("applies custom className to all components", () => {
		const { container } = render(
			<Card className="card-cls">
				<CardHeader className="header-cls">
					<CardTitle className="title-cls">T</CardTitle>
					<CardDescription className="desc-cls">D</CardDescription>
					<CardAction className="action-cls">A</CardAction>
				</CardHeader>
				<CardContent className="content-cls">C</CardContent>
				<CardFooter className="footer-cls">F</CardFooter>
			</Card>
		);
		expect(container.querySelector("[data-slot='card']")?.classList.contains("card-cls")).toBe(
			true
		);
		expect(
			container.querySelector("[data-slot='card-header']")?.classList.contains("header-cls")
		).toBe(true);
		expect(
			container.querySelector("[data-slot='card-title']")?.classList.contains("title-cls")
		).toBe(true);
		expect(
			container
				.querySelector("[data-slot='card-description']")
				?.classList.contains("desc-cls")
		).toBe(true);
		expect(
			container.querySelector("[data-slot='card-action']")?.classList.contains("action-cls")
		).toBe(true);
		expect(
			container.querySelector("[data-slot='card-content']")?.classList.contains("content-cls")
		).toBe(true);
		expect(
			container.querySelector("[data-slot='card-footer']")?.classList.contains("footer-cls")
		).toBe(true);
	});
});
