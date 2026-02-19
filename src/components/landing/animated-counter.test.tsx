import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, act } from "@testing-library/react";
import { AnimatedCounter } from "./animated-counter";

describe("AnimatedCounter", () => {
	let intersectionCallback: IntersectionObserverCallback;
	let observeMock: ReturnType<typeof vi.fn>;
	let disconnectMock: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		observeMock = vi.fn();
		disconnectMock = vi.fn();

		vi.stubGlobal(
			"IntersectionObserver",
			class {
				constructor(callback: IntersectionObserverCallback) {
					intersectionCallback = callback;
				}
				observe = observeMock;
				disconnect = disconnectMock;
				unobserve = vi.fn();
			}
		);
	});

	afterEach(() => {
		cleanup();
		vi.restoreAllMocks();
	});

	it("renders with initial display of 0", () => {
		render(<AnimatedCounter value="10" />);
		expect(screen.getByText("0")).toBeDefined();
	});

	it("applies custom className", () => {
		const { container } = render(<AnimatedCounter value="10" className="custom" />);
		expect(container.firstElementChild?.classList.contains("custom")).toBe(true);
	});

	it("observes element on mount", () => {
		render(<AnimatedCounter value="10" />);
		expect(observeMock).toHaveBeenCalledOnce();
	});

	it("starts animation when element intersects", () => {
		const rafSpy = vi.spyOn(window, "requestAnimationFrame").mockReturnValue(1);

		render(<AnimatedCounter value="10" />);

		act(() => {
			intersectionCallback(
				[{ isIntersecting: true } as IntersectionObserverEntry],
				{} as IntersectionObserver
			);
		});

		expect(rafSpy).toHaveBeenCalled();
		rafSpy.mockRestore();
	});

	it("displays non-numeric value directly", () => {
		render(<AnimatedCounter value="N/A" />);

		act(() => {
			intersectionCallback(
				[{ isIntersecting: true } as IntersectionObserverEntry],
				{} as IntersectionObserver
			);
		});

		expect(screen.getByText("N/A")).toBeDefined();
	});

	it("preserves suffix in animated value", () => {
		vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
			cb(Infinity);
			return 1;
		});

		render(<AnimatedCounter value="50+" />);

		act(() => {
			intersectionCallback(
				[{ isIntersecting: true } as IntersectionObserverEntry],
				{} as IntersectionObserver
			);
		});

		expect(screen.getByText("50+")).toBeDefined();
		vi.restoreAllMocks();
	});

	it("continues animation when progress < 1", () => {
		let callCount = 0;
		const rafSpy = vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
			callCount++;
			if (callCount <= 2) {
				// First call: start animation, second call: progress < 1 still animating
				cb(performance.now() + 100); // small elapsed time, progress < 1
			}
			return callCount;
		});

		render(<AnimatedCounter value="100" />);

		act(() => {
			intersectionCallback(
				[{ isIntersecting: true } as IntersectionObserverEntry],
				{} as IntersectionObserver
			);
		});

		// Should have called requestAnimationFrame multiple times (recursive)
		expect(rafSpy.mock.calls.length).toBeGreaterThanOrEqual(2);
		rafSpy.mockRestore();
	});

	it("does not re-animate on second intersection", () => {
		const rafSpy = vi.spyOn(window, "requestAnimationFrame").mockReturnValue(1);

		render(<AnimatedCounter value="10" />);

		act(() => {
			intersectionCallback(
				[{ isIntersecting: true } as IntersectionObserverEntry],
				{} as IntersectionObserver
			);
		});

		const callCount = rafSpy.mock.calls.length;

		act(() => {
			intersectionCallback(
				[{ isIntersecting: true } as IntersectionObserverEntry],
				{} as IntersectionObserver
			);
		});

		expect(rafSpy.mock.calls.length).toBe(callCount);
		rafSpy.mockRestore();
	});

	it("disconnects observer on unmount", () => {
		const { unmount } = render(<AnimatedCounter value="10" />);
		unmount();
		expect(disconnectMock).toHaveBeenCalledOnce();
	});
});
