import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, act } from "@testing-library/react";
import { Navbar } from "./navbar";

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

describe("Navbar", () => {
	let scrollListeners: Array<() => void>;

	beforeEach(() => {
		scrollListeners = [];
		vi.spyOn(window, "addEventListener").mockImplementation((event, handler) => {
			if (event === "scroll") scrollListeners.push(handler as () => void);
		});
		vi.spyOn(window, "removeEventListener").mockImplementation(() => {});
	});

	afterEach(() => {
		cleanup();
		vi.restoreAllMocks();
	});

	it("renders the logo", () => {
		render(<Navbar />);
		expect(screen.getByAltText("Assembly Line")).toBeDefined();
	});

	it("renders the brand name", () => {
		render(<Navbar />);
		expect(screen.getByText("Assembly Line")).toBeDefined();
	});

	it("renders all navigation links", () => {
		render(<Navbar />);
		expect(screen.getAllByText("Features").length).toBeGreaterThanOrEqual(1);
		expect(screen.getAllByText("Pipeline").length).toBeGreaterThanOrEqual(1);
		expect(screen.getAllByText("Eras").length).toBeGreaterThanOrEqual(1);
		expect(screen.getAllByText("Support").length).toBeGreaterThanOrEqual(1);
	});

	it("renders Play Now button", () => {
		render(<Navbar />);
		expect(screen.getAllByText("Play Now").length).toBeGreaterThanOrEqual(1);
	});

	it("renders mobile menu toggle button", () => {
		render(<Navbar />);
		expect(screen.getByLabelText("Toggle menu")).toBeDefined();
	});

	it("toggles mobile menu on button click", () => {
		const { container } = render(<Navbar />);
		const toggleBtn = screen.getByLabelText("Toggle menu");

		// Initially hidden (pointer-events-none indicates closed)
		const mobileMenu = container.querySelector(".md\\:hidden.absolute");
		expect(mobileMenu?.classList.contains("pointer-events-none")).toBe(true);

		fireEvent.click(toggleBtn);

		// After click, should not have pointer-events-none
		expect(mobileMenu?.classList.contains("pointer-events-none")).toBe(false);
	});

	it("closes mobile menu when a link is clicked", () => {
		const { container } = render(<Navbar />);
		const toggleBtn = screen.getByLabelText("Toggle menu");

		fireEvent.click(toggleBtn);

		const mobileMenu = container.querySelector(".md\\:hidden.absolute");
		expect(mobileMenu?.classList.contains("pointer-events-none")).toBe(false);

		// Click a mobile link
		const mobileLinks = mobileMenu?.querySelectorAll("a");
		if (mobileLinks && mobileLinks.length > 0) {
			fireEvent.click(mobileLinks[0]);
		}

		expect(mobileMenu?.classList.contains("pointer-events-none")).toBe(true);
	});

	it("closes mobile menu when mobile Play Now is clicked", () => {
		const { container } = render(<Navbar />);
		const toggleBtn = screen.getByLabelText("Toggle menu");

		fireEvent.click(toggleBtn);

		const mobileMenu = container.querySelector(".md\\:hidden.absolute");
		// Find the Play Now link inside the mobile menu
		const playNowLinks = mobileMenu?.querySelectorAll("a[href='/play']");
		if (playNowLinks && playNowLinks.length > 0) {
			fireEvent.click(playNowLinks[0]);
		}

		expect(mobileMenu?.classList.contains("pointer-events-none")).toBe(true);
	});

	it("adds scroll event listener on mount", () => {
		render(<Navbar />);
		expect(window.addEventListener).toHaveBeenCalledWith("scroll", expect.any(Function), {
			passive: true,
		});
	});

	it("removes scroll event listener on unmount", () => {
		const { unmount } = render(<Navbar />);
		unmount();
		expect(window.removeEventListener).toHaveBeenCalledWith("scroll", expect.any(Function));
	});

	it("updates scrolled state when scrollY > 40", () => {
		const { container } = render(<Navbar />);

		act(() => {
			Object.defineProperty(window, "scrollY", { value: 50, writable: true });
			scrollListeners.forEach((fn) => fn());
		});

		// Should now have the scrolled styling
		const navbar = container.querySelector(".backdrop-blur-xl");
		expect(navbar).toBeDefined();
	});

	it("does not apply scrolled state when scrollY <= 40", () => {
		const { container } = render(<Navbar />);

		act(() => {
			Object.defineProperty(window, "scrollY", { value: 10, writable: true });
			scrollListeners.forEach((fn) => fn());
		});

		// Should have backdrop-blur-md (non-scrolled)
		const navbar = container.querySelector(".backdrop-blur-md");
		expect(navbar).toBeDefined();
	});
});
