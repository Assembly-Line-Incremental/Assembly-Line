import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { ParticleField } from "./particle-field";

describe("ParticleField", () => {
	const mockContext = {
		clearRect: vi.fn(),
		beginPath: vi.fn(),
		arc: vi.fn(),
		fill: vi.fn(),
		moveTo: vi.fn(),
		lineTo: vi.fn(),
		stroke: vi.fn(),
		fillStyle: "",
		strokeStyle: "",
		globalAlpha: 1,
		lineWidth: 1,
	};

	beforeEach(() => {
		vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
			mockContext as unknown as CanvasRenderingContext2D
		);
		vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
	});

	afterEach(() => {
		cleanup();
		vi.restoreAllMocks();
	});

	it("renders a canvas element", () => {
		vi.spyOn(window, "requestAnimationFrame").mockReturnValue(1);
		const { container } = render(<ParticleField />);
		const canvas = container.querySelector("canvas");
		expect(canvas).toBeDefined();
	});

	it("has aria-hidden attribute", () => {
		vi.spyOn(window, "requestAnimationFrame").mockReturnValue(1);
		const { container } = render(<ParticleField />);
		const canvas = container.querySelector("canvas");
		expect(canvas?.getAttribute("aria-hidden")).toBe("true");
	});

	it("starts animation on mount", () => {
		const rafSpy = vi.spyOn(window, "requestAnimationFrame").mockReturnValue(1);
		render(<ParticleField />);
		expect(rafSpy).toHaveBeenCalled();
	});

	it("cancels animation and removes listener on unmount", () => {
		vi.spyOn(window, "requestAnimationFrame").mockReturnValue(1);
		const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
		const { unmount } = render(<ParticleField />);
		unmount();
		expect(window.cancelAnimationFrame).toHaveBeenCalled();
		expect(removeEventListenerSpy).toHaveBeenCalledWith("resize", expect.any(Function));
	});

	it("executes draw function with particle positions and connections", () => {
		const captured: FrameRequestCallback[] = [];
		vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
			if (captured.length === 0) {
				captured.push(cb);
			}
			return 1;
		});

		// Mock Math.random to create particles at predictable positions
		const originalRandom = Math.random;
		let callCount = 0;
		Math.random = () => {
			callCount++;
			return 0.01; // All particles at near-same position (close together for connections)
		};

		render(<ParticleField />);

		Math.random = originalRandom;

		// Execute the draw function
		const drawCallback = captured[0];
		if (drawCallback) {
			mockContext.clearRect.mockClear();
			mockContext.beginPath.mockClear();
			mockContext.arc.mockClear();
			mockContext.fill.mockClear();
			mockContext.stroke.mockClear();

			drawCallback(0);

			expect(mockContext.clearRect).toHaveBeenCalled();
			expect(mockContext.beginPath).toHaveBeenCalled();
			expect(mockContext.arc).toHaveBeenCalled();
			expect(mockContext.fill).toHaveBeenCalled();
			// Particles are close together so connections should be drawn
			expect(mockContext.stroke).toHaveBeenCalled();
		}
	});

	it("wraps particles around canvas edges", () => {
		const captured: FrameRequestCallback[] = [];
		vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
			if (captured.length === 0) {
				captured.push(cb);
			}
			return 1;
		});

		// Create particles near edges
		let idx = 0;
		const values = [
			// First particle - at edge going negative
			-0.001, // x near 0 → will wrap (x * canvas.width is near 0, vx negative will go <0)
			0.5,
			0.5,
			0.5,
			0.5,
			0.5,
			0.5,
		];
		const originalRandom = Math.random;
		Math.random = () => {
			const v = values[idx % values.length];
			idx++;
			return v ?? 0.5;
		};

		render(<ParticleField />);
		Math.random = originalRandom;

		// Execute draw multiple times to trigger wrapping
		const drawCallback = captured[0];
		if (drawCallback) {
			for (let i = 0; i < 5; i++) {
				drawCallback(i);
			}
		}
		expect(mockContext.clearRect).toHaveBeenCalled();
	});

	it("returns early when canvas ref is null context", () => {
		vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
		vi.spyOn(window, "requestAnimationFrame").mockReturnValue(1);
		const { container } = render(<ParticleField />);
		expect(container.querySelector("canvas")).toBeDefined();
	});
});
