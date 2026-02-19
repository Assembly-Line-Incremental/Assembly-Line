import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./page";

vi.mock("next/link", () => ({
	default: ({
		children,
		href,
		...props
	}: {
		children: React.ReactNode;
		href: string;
		[key: string]: unknown;
	}) => (
		<a href={href} {...props}>
			{children}
		</a>
	),
}));

vi.mock("next/image", () => ({
	default: ({ alt, ...props }: { alt: string; [key: string]: unknown }) => (
		// eslint-disable-next-line @next/next/no-img-element
		<img alt={alt} {...props} />
	),
}));

vi.mock("@/components/landing/hero-section", () => ({
	HeroSection: () => <div data-testid="hero-section" />,
}));

vi.mock("@/components/landing/navbar", () => ({
	Navbar: () => <nav data-testid="navbar" />,
}));

vi.mock("@/components/landing/conveyor-belt", () => ({
	ConveyorBelt: () => <div data-testid="conveyor-belt" />,
}));

vi.mock("@/components/landing/scroll-reveal", () => ({
	ScrollReveal: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/landing/animated-counter", () => ({
	AnimatedCounter: ({ value, className }: { value: string; className?: string }) => (
		<span className={className}>{value}</span>
	),
}));

vi.mock("@/components/landing/feature-card", () => ({
	FeatureCard: ({ title }: { title: string }) => <div data-testid="feature-card">{title}</div>,
}));

describe("Home", () => {
	it("renders the navbar", () => {
		render(<Home />);
		expect(screen.getByTestId("navbar")).toBeDefined();
	});

	it("renders the hero section", () => {
		render(<Home />);
		expect(screen.getByTestId("hero-section")).toBeDefined();
	});

	it("renders conveyor belts", () => {
		render(<Home />);
		expect(screen.getAllByTestId("conveyor-belt").length).toBeGreaterThanOrEqual(1);
	});

	it("renders the features section", () => {
		render(<Home />);
		expect(screen.getByText("Build. Optimize.")).toBeDefined();
		expect(screen.getByText("Dominate.")).toBeDefined();
	});

	it("renders all 6 feature cards", () => {
		render(<Home />);
		expect(screen.getAllByTestId("feature-card")).toHaveLength(6);
	});

	it("renders the pipeline section", () => {
		render(<Home />);
		expect(screen.getByText(/From raw matter to/)).toBeDefined();
		expect(screen.getByText("galactic empire")).toBeDefined();
	});

	it("renders all 5 pipeline steps", () => {
		render(<Home />);
		expect(screen.getByText("Step 01")).toBeDefined();
		expect(screen.getByText("Step 05")).toBeDefined();
	});

	it("renders the eras section", () => {
		render(<Home />);
		expect(screen.getByText(/Six eras of/)).toBeDefined();
		expect(screen.getByText("industrial evolution")).toBeDefined();
	});

	it("renders all 6 eras", () => {
		render(<Home />);
		expect(screen.getByText("Foundation")).toBeDefined();
		expect(screen.getByText("Beyond")).toBeDefined();
	});

	it("renders the support section", () => {
		render(<Home />);
		expect(screen.getByText(/Support the game,/)).toBeDefined();
	});

	it("renders all 3 support tiers", () => {
		render(<Home />);
		expect(screen.getByText("Bronze")).toBeDefined();
		expect(screen.getByText("Silver")).toBeDefined();
		expect(screen.getByText("Gold")).toBeDefined();
	});

	it("renders the final CTA section", () => {
		render(<Home />);
		expect(screen.getByText(/Ready to build your/)).toBeDefined();
		expect(screen.getByText("Start Building")).toBeDefined();
	});

	it("renders the footer", () => {
		render(<Home />);
		expect(screen.getByLabelText("GitHub")).toBeDefined();
		expect(screen.getByLabelText("Discord")).toBeDefined();
	});

	it("renders stat values", () => {
		render(<Home />);
		expect(screen.getByText("10")).toBeDefined();
		expect(screen.getByText("9")).toBeDefined();
		expect(screen.getByText("50+")).toBeDefined();
		expect(screen.getAllByText("6").length).toBeGreaterThanOrEqual(1);
	});

	it("renders stat labels", () => {
		render(<Home />);
		expect(screen.getByText("Machines")).toBeDefined();
		expect(screen.getByText("Resources")).toBeDefined();
		expect(screen.getByText("Technologies")).toBeDefined();
		expect(screen.getAllByText("Eras").length).toBeGreaterThanOrEqual(1);
	});
});
