import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "./tooltip";

describe("Tooltip", () => {
	it("renders trigger", () => {
		render(
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>Hover</TooltipTrigger>
					<TooltipContent>Tip</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		);
		expect(screen.getByText("Hover")).toBeDefined();
	});
});
