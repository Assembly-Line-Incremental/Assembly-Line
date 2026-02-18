import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "./input-otp";

beforeAll(() => {
	vi.stubGlobal(
		"ResizeObserver",
		class {
			observe = vi.fn();
			unobserve = vi.fn();
			disconnect = vi.fn();
		}
	);
});

describe("InputOTP", () => {
	it("renders otp input", () => {
		const { container } = render(
			<InputOTP maxLength={4}>
				<InputOTPGroup>
					<InputOTPSlot index={0} />
					<InputOTPSlot index={1} />
				</InputOTPGroup>
				<InputOTPSeparator />
				<InputOTPGroup>
					<InputOTPSlot index={2} />
					<InputOTPSlot index={3} />
				</InputOTPGroup>
			</InputOTP>
		);
		expect(container.querySelector("[data-slot='input-otp']")).toBeDefined();
	});

	it("renders separator with role", () => {
		render(
			<InputOTP maxLength={2}>
				<InputOTPGroup>
					<InputOTPSlot index={0} />
				</InputOTPGroup>
				<InputOTPSeparator />
				<InputOTPGroup>
					<InputOTPSlot index={1} />
				</InputOTPGroup>
			</InputOTP>
		);
		expect(screen.getByRole("separator")).toBeDefined();
	});

	it("renders slots with data-slot attribute", () => {
		const { container } = render(
			<InputOTP maxLength={2}>
				<InputOTPGroup>
					<InputOTPSlot index={0} />
					<InputOTPSlot index={1} />
				</InputOTPGroup>
			</InputOTP>
		);
		expect(container.querySelectorAll("[data-slot='input-otp-slot']")).toHaveLength(2);
	});

	it("applies custom className", () => {
		const { container } = render(
			<InputOTP maxLength={2} className="custom" containerClassName="container-cls">
				<InputOTPGroup className="group-cls">
					<InputOTPSlot index={0} className="slot-cls" />
					<InputOTPSlot index={1} />
				</InputOTPGroup>
			</InputOTP>
		);
		expect(
			container
				.querySelector("[data-slot='input-otp-group']")
				?.classList.contains("group-cls")
		).toBe(true);
		expect(
			container.querySelector("[data-slot='input-otp-slot']")?.classList.contains("slot-cls")
		).toBe(true);
	});
});
