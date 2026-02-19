import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { HeroSection } from "./hero-section";

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

vi.mock("./particle-field", () => ({
	ParticleField: () => <div data-testid="particle-field" />,
}));

describe("HeroSection", () => {
	it("renders the ParticleField component", () => {
		render(<HeroSection />);
		expect(screen.getByTestId("particle-field")).toBeDefined();
	});

	it("renders the title ASSEMBLY LINE", () => {
		render(<HeroSection />);
		expect(screen.getByText("ASSEMBLY")).toBeDefined();
		expect(screen.getByText("LINE")).toBeDefined();
	});

	it("renders the h1 heading", () => {
		render(<HeroSection />);
		expect(screen.getByRole("heading", { level: 1 })).toBeDefined();
	});

	it("renders the tagline", () => {
		render(<HeroSection />);
		expect(
			screen.getByText(/Build machines\. Chain resources\. Optimize endlessly\./)
		).toBeDefined();
	});

	it("renders the incremental factory game subtitle", () => {
		render(<HeroSection />);
		expect(screen.getByText("The incremental factory game.")).toBeDefined();
	});

	it("renders Play Now button linking to /play", () => {
		render(<HeroSection />);
		const playLink = screen.getByText("Play Now").closest("a");
		expect(playLink?.getAttribute("href")).toBe("/play");
	});

	it("renders Learn More button linking to #features", () => {
		render(<HeroSection />);
		const learnMore = screen.getByText("Learn More").closest("a");
		expect(learnMore?.getAttribute("href")).toBe("#features");
	});

	it("renders the version badge", () => {
		render(<HeroSection />);
		expect(screen.getByText(/Early Development/)).toBeDefined();
	});

	it("renders the logo image", () => {
		render(<HeroSection />);
		expect(screen.getByAltText("Assembly Line")).toBeDefined();
	});
});
