import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import GlobalError from "./global-error";

const { mockCaptureException } = vi.hoisted(() => ({
	mockCaptureException: vi.fn(),
}));

vi.mock("@sentry/nextjs", () => ({
	captureException: mockCaptureException,
}));

vi.mock("next/error", () => ({
	default: ({ statusCode }: { statusCode: number }) => (
		<div data-testid="next-error">Error {statusCode}</div>
	),
}));

describe("GlobalError", () => {
	beforeEach(() => {
		mockCaptureException.mockClear();
	});

	it("calls Sentry.captureException with the error", () => {
		const error = new Error("test error");
		render(<GlobalError error={error} />);
		expect(mockCaptureException).toHaveBeenCalledOnce();
		expect(mockCaptureException).toHaveBeenCalledWith(error);
	});

	it("calls Sentry.captureException when error changes", () => {
		const firstError = new Error("first error");
		const secondError = new Error("second error");

		const { rerender } = render(<GlobalError error={firstError} />);
		expect(mockCaptureException).toHaveBeenCalledWith(firstError);

		mockCaptureException.mockClear();
		rerender(<GlobalError error={secondError} />);
		expect(mockCaptureException).toHaveBeenCalledWith(secondError);
	});

	it("renders the NextError component with statusCode 0", () => {
		const error = new Error("test error");
		render(<GlobalError error={error} />);
		expect(screen.getByTestId("next-error")).toBeDefined();
		expect(screen.getByText("Error 0")).toBeDefined();
	});
});
