import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./accordion";

describe("Accordion", () => {
	it("renders accordion with items", () => {
		render(
			<Accordion type="single" collapsible>
				<AccordionItem value="item-1">
					<AccordionTrigger>Section 1</AccordionTrigger>
					<AccordionContent>Content 1</AccordionContent>
				</AccordionItem>
			</Accordion>
		);
		expect(screen.getByText("Section 1")).toBeDefined();
	});

	it("applies custom className to item", () => {
		render(
			<Accordion type="single" collapsible>
				<AccordionItem value="item-1" className="custom">
					<AccordionTrigger>Trigger</AccordionTrigger>
					<AccordionContent>Content</AccordionContent>
				</AccordionItem>
			</Accordion>
		);
		expect(
			screen
				.getByText("Trigger")
				.closest("[data-slot='accordion-item']")
				?.classList.contains("custom")
		).toBe(true);
	});
});
