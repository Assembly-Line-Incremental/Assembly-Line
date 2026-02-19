import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
	Avatar,
	AvatarImage,
	AvatarFallback,
	AvatarGroup,
	AvatarGroupCount,
	AvatarBadge,
} from "./avatar";

describe("Avatar", () => {
	it("renders with fallback", () => {
		render(
			<Avatar>
				<AvatarFallback>JD</AvatarFallback>
			</Avatar>
		);
		expect(screen.getByText("JD")).toBeDefined();
	});

	it("applies custom className", () => {
		const { container } = render(
			<Avatar className="custom">
				<AvatarFallback>AB</AvatarFallback>
			</Avatar>
		);
		expect(container.firstElementChild?.classList.contains("custom")).toBe(true);
	});

	it("renders image", () => {
		const { container } = render(
			<Avatar>
				<AvatarImage src="/test.jpg" alt="test" />
				<AvatarFallback>T</AvatarFallback>
			</Avatar>
		);
		expect(container.querySelector("[data-slot='avatar-image']")).toBeDefined();
	});

	it("supports size variants", () => {
		const { container } = render(
			<Avatar size="lg">
				<AvatarFallback>LG</AvatarFallback>
			</Avatar>
		);
		expect(container.firstElementChild?.getAttribute("data-size")).toBe("lg");
	});
});

describe("AvatarBadge", () => {
	it("renders badge with data-slot", () => {
		const { container } = render(
			<Avatar>
				<AvatarFallback>X</AvatarFallback>
				<AvatarBadge />
			</Avatar>
		);
		expect(container.querySelector("[data-slot='avatar-badge']")).toBeDefined();
	});
});

describe("AvatarGroup", () => {
	it("renders group with count", () => {
		render(
			<AvatarGroup>
				<Avatar>
					<AvatarFallback>A</AvatarFallback>
				</Avatar>
				<AvatarGroupCount>+3</AvatarGroupCount>
			</AvatarGroup>
		);
		expect(screen.getByText("A")).toBeDefined();
		expect(screen.getByText("+3")).toBeDefined();
	});
});
