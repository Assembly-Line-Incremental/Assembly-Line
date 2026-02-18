import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbPage,
	BreadcrumbSeparator,
	BreadcrumbEllipsis,
} from "./breadcrumb";

describe("Breadcrumb", () => {
	it("renders breadcrumb navigation", () => {
		render(
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/">Home</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>Current</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
		);
		expect(screen.getByRole("navigation")).toBeDefined();
		expect(screen.getByText("Home")).toBeDefined();
		expect(screen.getByText("Current")).toBeDefined();
	});

	it("renders ellipsis with data-slot", () => {
		const { container } = render(
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbEllipsis />
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
		);
		expect(container.querySelector("[data-slot='breadcrumb-ellipsis']")).toBeDefined();
	});

	it("renders BreadcrumbLink with asChild", () => {
		render(
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<span>Custom Link</span>
						</BreadcrumbLink>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
		);
		expect(screen.getByText("Custom Link").tagName).toBe("SPAN");
	});

	it("renders BreadcrumbSeparator with custom children", () => {
		render(
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/">Home</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator>/</BreadcrumbSeparator>
					<BreadcrumbItem>
						<BreadcrumbPage>Current</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
		);
		expect(screen.getByText("/")).toBeDefined();
	});
});
