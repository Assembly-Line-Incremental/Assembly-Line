import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ScrollReveal } from "./scroll-reveal";

describe("ScrollReveal", () => {
	let observeMock: ReturnType<typeof vi.fn>;
	let disconnectMock: ReturnType<typeof vi.fn>;
	let unobserveMock: ReturnType<typeof vi.fn>;
	let intersectionCallback: IntersectionObserverCallback;

	beforeEach(() => {
		observeMock = vi.fn();
		disconnectMock = vi.fn();
		unobserveMock = vi.fn();

		vi.stubGlobal(
			"IntersectionObserver",
			class {
				constructor(callback: IntersectionObserverCallback) {
					intersectionCallback = callback;
				}
				observe = observeMock;
				disconnect = disconnectMock;
				unobserve = unobserveMock;
			}
		);
	});

	afterEach(() => {
		cleanup();
		vi.restoreAllMocks();
	});

	it("renders children", () => {
		render(
			<ScrollReveal>
				<span>Hello</span>
			</ScrollReveal>
		);
		expect(screen.getByText("Hello")).toBeDefined();
	});

	it("applies custom className", () => {
		const { container } = render(
			<ScrollReveal className="custom-class">
				<span>Test</span>
			</ScrollReveal>
		);
		expect(container.firstElementChild?.classList.contains("custom-class")).toBe(true);
	});

	it("sets initial opacity to 0", () => {
		const { container } = render(
			<ScrollReveal>
				<span>Test</span>
			</ScrollReveal>
		);
		expect((container.firstElementChild as HTMLElement).style.opacity).toBe("0");
	});

	it("observes element on mount", () => {
		render(
			<ScrollReveal>
				<span>Test</span>
			</ScrollReveal>
		);
		expect(observeMock).toHaveBeenCalledOnce();
	});

	it("reveals element when intersecting", () => {
		const { container } = render(
			<ScrollReveal>
				<span>Test</span>
			</ScrollReveal>
		);
		const el = container.firstElementChild as HTMLElement;

		intersectionCallback(
			[{ isIntersecting: true, target: el } as unknown as IntersectionObserverEntry],
			{} as IntersectionObserver
		);

		expect(el.style.opacity).toBe("1");
		expect(el.style.transform).toBe("none");
	});

	it("unobserves after reveal when once is true", () => {
		const { container } = render(
			<ScrollReveal once={true}>
				<span>Test</span>
			</ScrollReveal>
		);
		const el = container.firstElementChild as HTMLElement;

		intersectionCallback(
			[{ isIntersecting: true, target: el } as unknown as IntersectionObserverEntry],
			{} as IntersectionObserver
		);

		expect(unobserveMock).toHaveBeenCalledOnce();
	});

	it("re-hides element when not intersecting and once is false", () => {
		const { container } = render(
			<ScrollReveal once={false}>
				<span>Test</span>
			</ScrollReveal>
		);
		const el = container.firstElementChild as HTMLElement;

		intersectionCallback(
			[{ isIntersecting: true, target: el } as unknown as IntersectionObserverEntry],
			{} as IntersectionObserver
		);
		expect(el.style.opacity).toBe("1");

		intersectionCallback(
			[{ isIntersecting: false, target: el } as unknown as IntersectionObserverEntry],
			{} as IntersectionObserver
		);
		expect(el.style.opacity).toBe("0");
	});

	it("does not re-hide when not intersecting and once is true", () => {
		const { container } = render(
			<ScrollReveal once={true}>
				<span>Test</span>
			</ScrollReveal>
		);
		const el = container.firstElementChild as HTMLElement;

		// Not intersecting with once=true - should stay hidden (opacity 0)
		intersectionCallback(
			[{ isIntersecting: false, target: el } as unknown as IntersectionObserverEntry],
			{} as IntersectionObserver
		);
		expect(el.style.opacity).toBe("0");
	});

	it("disconnects observer on unmount", () => {
		const { unmount } = render(
			<ScrollReveal>
				<span>Test</span>
			</ScrollReveal>
		);
		unmount();
		expect(disconnectMock).toHaveBeenCalledOnce();
	});

	it("applies correct transform for direction left", () => {
		const { container } = render(
			<ScrollReveal direction="left" distance={50}>
				<span>Test</span>
			</ScrollReveal>
		);
		expect((container.firstElementChild as HTMLElement).style.transform).toBe(
			"translateX(50px)"
		);
	});

	it("applies correct transform for direction right", () => {
		const { container } = render(
			<ScrollReveal direction="right" distance={50}>
				<span>Test</span>
			</ScrollReveal>
		);
		expect((container.firstElementChild as HTMLElement).style.transform).toBe(
			"translateX(-50px)"
		);
	});

	it("applies correct transform for direction down", () => {
		const { container } = render(
			<ScrollReveal direction="down" distance={50}>
				<span>Test</span>
			</ScrollReveal>
		);
		expect((container.firstElementChild as HTMLElement).style.transform).toBe(
			"translateY(-50px)"
		);
	});

	it("applies correct transform for direction none", () => {
		const { container } = render(
			<ScrollReveal direction="none">
				<span>Test</span>
			</ScrollReveal>
		);
		expect((container.firstElementChild as HTMLElement).style.transform).toBe("none");
	});
});
