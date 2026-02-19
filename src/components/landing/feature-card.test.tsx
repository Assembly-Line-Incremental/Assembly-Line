import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FeatureCard } from "./feature-card";
import { Zap } from "lucide-react";

describe("FeatureCard", () => {
	const defaultProps = {
		icon: Zap,
		title: "Test Feature",
		description: "Test description text",
		color: "#00D4FF",
	};

	it("renders the title", () => {
		render(<FeatureCard {...defaultProps} />);
		expect(screen.getByText("Test Feature")).toBeDefined();
	});

	it("renders the description", () => {
		render(<FeatureCard {...defaultProps} />);
		expect(screen.getByText("Test description text")).toBeDefined();
	});

	it("renders the icon with correct color", () => {
		const { container } = render(<FeatureCard {...defaultProps} />);
		const svg = container.querySelector("svg");
		expect(svg).toBeDefined();
		expect(svg?.style.color).toBe("rgb(0, 212, 255)");
	});

	it("updates CSS custom properties on mouse move", () => {
		const { container } = render(<FeatureCard {...defaultProps} />);
		const card = container.firstElementChild as HTMLElement;

		vi.spyOn(card, "getBoundingClientRect").mockReturnValue({
			left: 0,
			top: 0,
			width: 200,
			height: 200,
			right: 200,
			bottom: 200,
			x: 0,
			y: 0,
			toJSON: () => {},
		});

		fireEvent.mouseMove(card, { clientX: 100, clientY: 100 });

		expect(card.style.getPropertyValue("--mouse-x")).toBe("50%");
		expect(card.style.getPropertyValue("--mouse-y")).toBe("50%");
	});
});
