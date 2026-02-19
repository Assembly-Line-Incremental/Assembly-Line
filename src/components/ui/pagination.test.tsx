import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationPrevious,
	PaginationNext,
	PaginationEllipsis,
} from "./pagination";

describe("Pagination", () => {
	it("renders pagination navigation", () => {
		render(
			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious href="#" />
					</PaginationItem>
					<PaginationItem>
						<PaginationLink href="#">1</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationEllipsis />
					</PaginationItem>
					<PaginationItem>
						<PaginationNext href="#" />
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		);
		expect(screen.getByRole("navigation")).toBeDefined();
		expect(screen.getByText("1")).toBeDefined();
	});

	it("renders previous and next labels", () => {
		render(
			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious href="#" />
					</PaginationItem>
					<PaginationItem>
						<PaginationNext href="#" />
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		);
		expect(screen.getByText("Previous")).toBeDefined();
		expect(screen.getByText("Next")).toBeDefined();
	});

	it("renders active pagination link", () => {
		const { container } = render(
			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationLink href="#" isActive>
							1
						</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationLink href="#">2</PaginationLink>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		);
		const activeLink = container.querySelector("[aria-current='page']");
		expect(activeLink).toBeDefined();
		expect(activeLink?.getAttribute("data-active")).toBe("true");
	});

	it("applies custom className to pagination", () => {
		const { container } = render(
			<Pagination className="custom">
				<PaginationContent className="content-cls">
					<PaginationItem>
						<PaginationLink href="#" className="link-cls">
							1
						</PaginationLink>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		);
		expect(
			container.querySelector("[data-slot='pagination']")?.classList.contains("custom")
		).toBe(true);
		expect(
			container
				.querySelector("[data-slot='pagination-content']")
				?.classList.contains("content-cls")
		).toBe(true);
		expect(
			container.querySelector("[data-slot='pagination-link']")?.classList.contains("link-cls")
		).toBe(true);
	});
});
