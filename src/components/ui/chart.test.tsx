import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import {
	ChartContainer,
	ChartStyle,
	ChartTooltipContent,
	ChartLegendContent,
	type ChartConfig,
} from "./chart";

// Mock recharts ResponsiveContainer to avoid measurement issues in tests
vi.mock("recharts", async () => {
	const actual = await vi.importActual("recharts");
	return {
		...actual,
		ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
			<div data-testid="responsive-container">{children}</div>
		),
	};
});

describe("ChartContainer", () => {
	const config: ChartConfig = {
		revenue: { label: "Revenue", color: "#00D4FF" },
		expenses: { label: "Expenses", color: "#FF4422" },
	};

	it("renders with data-slot attribute", () => {
		const { container } = render(
			<ChartContainer config={config}>
				<div>Chart</div>
			</ChartContainer>
		);
		expect(container.querySelector("[data-slot='chart']")).toBeDefined();
	});

	it("renders children inside responsive container", () => {
		render(
			<ChartContainer config={config}>
				<div>Chart content</div>
			</ChartContainer>
		);
		expect(screen.getByText("Chart content")).toBeDefined();
	});

	it("applies custom className", () => {
		const { container } = render(
			<ChartContainer config={config} className="custom">
				<div>X</div>
			</ChartContainer>
		);
		expect(container.querySelector("[data-slot='chart']")?.classList.contains("custom")).toBe(
			true
		);
	});

	it("uses provided id for chart id", () => {
		const { container } = render(
			<ChartContainer config={config} id="my-chart">
				<div>X</div>
			</ChartContainer>
		);
		expect(container.querySelector("[data-chart='chart-my-chart']")).toBeDefined();
	});
});

describe("ChartStyle", () => {
	it("renders nothing when config has no color entries", () => {
		const config: ChartConfig = { test: { label: "Test" } };
		const { container } = render(<ChartStyle id="test" config={config} />);
		expect(container.querySelector("style")).toBeNull();
	});

	it("renders style tag when config has colors", () => {
		const config: ChartConfig = { revenue: { color: "#00D4FF", label: "Revenue" } };
		const { container } = render(<ChartStyle id="test" config={config} />);
		expect(container.querySelector("style")).toBeDefined();
	});

	it("renders theme-based colors", () => {
		const config: ChartConfig = {
			revenue: {
				label: "Revenue",
				theme: { light: "#000", dark: "#fff" },
			},
		};
		const { container } = render(<ChartStyle id="test" config={config} />);
		const style = container.querySelector("style");
		expect(style?.innerHTML).toContain("--color-revenue");
	});

	it("returns null for entry where theme resolves to empty color", () => {
		const config: ChartConfig = {
			empty: {
				label: "Empty",
				theme: { light: "", dark: "" },
			},
		};
		const { container } = render(<ChartStyle id="empty" config={config} />);
		const style = container.querySelector("style");
		expect(style?.innerHTML).not.toContain("--color-empty");
	});

	it("handles mixed theme and color entries", () => {
		const config: ChartConfig = {
			a: { label: "A", color: "#111" },
			b: { label: "B", theme: { light: "#222", dark: "#333" } },
		};
		const { container } = render(<ChartStyle id="mixed" config={config} />);
		const style = container.querySelector("style");
		expect(style?.innerHTML).toContain("--color-a");
		expect(style?.innerHTML).toContain("--color-b");
	});
});

describe("ChartTooltipContent", () => {
	const config: ChartConfig = {
		revenue: { label: "Revenue", color: "#00D4FF" },
		expenses: { label: "Expenses", color: "#FF4422" },
	};

	const Wrapper = ({ children }: { children: React.ReactNode }) => (
		<ChartContainer config={config}>
			<>{children}</>
		</ChartContainer>
	);

	it("returns null when not active", () => {
		const { container } = render(
			<Wrapper>
				<ChartTooltipContent active={false} payload={[]} />
			</Wrapper>
		);
		expect(container.querySelector(".border-border\\/50")).toBeNull();
	});

	it("returns null when payload is empty", () => {
		const { container } = render(
			<Wrapper>
				<ChartTooltipContent active={true} payload={[]} />
			</Wrapper>
		);
		expect(container.querySelector(".border-border\\/50")).toBeNull();
	});

	it("returns null when payload is undefined", () => {
		const { container } = render(
			<Wrapper>
				<ChartTooltipContent active={true} />
			</Wrapper>
		);
		expect(container.querySelector(".border-border\\/50")).toBeNull();
	});

	it("renders with no value on item", () => {
		const { container } = render(
			<Wrapper>
				<ChartTooltipContent
					active={true}
					payload={[
						{
							name: "revenue",
							value: undefined,
							dataKey: "revenue",
							color: "#00D4FF",
							payload: { fill: "#00D4FF" },
							type: "line",
						} as never,
					]}
					label="Jan"
				/>
			</Wrapper>
		);
		expect(container.querySelector(".tabular-nums")).toBeNull();
	});

	it("renders with label that does not map to config (plain label)", () => {
		render(
			<Wrapper>
				<ChartTooltipContent
					active={true}
					payload={[
						{
							name: "revenue",
							value: 100,
							dataKey: "revenue",
							color: "#00D4FF",
							payload: { fill: "#00D4FF" },
							type: "line",
						} as never,
					]}
					label="Unknown Label"
				/>
			</Wrapper>
		);
		expect(screen.getByText("Unknown Label")).toBeDefined();
	});

	it("handles tooltipLabel with no value (returns null)", () => {
		const { container } = render(
			<Wrapper>
				<ChartTooltipContent
					active={true}
					payload={[
						{
							name: "nonexistent",
							value: 100,
							dataKey: "nonexistent",
							color: "#00D4FF",
							payload: { fill: "#00D4FF" },
							type: "line",
						} as never,
					]}
					label=""
				/>
			</Wrapper>
		);
		// Empty label with no config match => value is falsy => tooltipLabel returns null
		expect(container.querySelector(".border-border\\/50")).toBeDefined();
	});

	it("renders tooltip with payload items", () => {
		const { container } = render(
			<Wrapper>
				<ChartTooltipContent
					active={true}
					payload={[
						{
							name: "revenue",
							value: 1000,
							dataKey: "revenue",
							color: "#00D4FF",
							payload: { fill: "#00D4FF" },
							type: "line",
						} as never,
					]}
					label="Jan"
				/>
			</Wrapper>
		);
		expect(container.querySelector(".tabular-nums")).toBeDefined();
		expect(screen.getByText("Jan")).toBeDefined();
	});

	it("renders tooltip with label from config", () => {
		render(
			<Wrapper>
				<ChartTooltipContent
					active={true}
					payload={[
						{
							name: "revenue",
							value: 500,
							dataKey: "revenue",
							color: "#00D4FF",
							payload: { fill: "#00D4FF" },
							type: "line",
						} as never,
					]}
					label="revenue"
				/>
			</Wrapper>
		);
		expect(screen.getAllByText("Revenue").length).toBeGreaterThanOrEqual(1);
	});

	it("hides label when hideLabel is true", () => {
		const { container } = render(
			<Wrapper>
				<ChartTooltipContent
					active={true}
					payload={[
						{
							name: "revenue",
							value: 100,
							dataKey: "revenue",
							color: "#00D4FF",
							payload: { fill: "#00D4FF" },
							type: "line",
						} as never,
					]}
					label="Jan"
					hideLabel
				/>
			</Wrapper>
		);
		// The label div with the text "Jan" should not be rendered
		expect(screen.queryByText("Jan")).toBeNull();
	});

	it("hides indicator when hideIndicator is true", () => {
		const { container } = render(
			<Wrapper>
				<ChartTooltipContent
					active={true}
					payload={[
						{
							name: "revenue",
							value: 100,
							dataKey: "revenue",
							color: "#00D4FF",
							payload: { fill: "#00D4FF" },
							type: "line",
						} as never,
					]}
					label="Jan"
					hideIndicator
				/>
			</Wrapper>
		);
		expect(container.querySelector("[style*='--color-bg']")).toBeNull();
	});

	it("renders with line indicator", () => {
		const { container } = render(
			<Wrapper>
				<ChartTooltipContent
					active={true}
					payload={[
						{
							name: "revenue",
							value: 100,
							dataKey: "revenue",
							color: "#00D4FF",
							payload: { fill: "#00D4FF" },
							type: "line",
						} as never,
					]}
					label="Jan"
					indicator="line"
				/>
			</Wrapper>
		);
		expect(container.querySelector(".w-1")).toBeDefined();
	});

	it("renders with dashed indicator", () => {
		const { container } = render(
			<Wrapper>
				<ChartTooltipContent
					active={true}
					payload={[
						{
							name: "revenue",
							value: 100,
							dataKey: "revenue",
							color: "#00D4FF",
							payload: { fill: "#00D4FF" },
							type: "line",
						} as never,
					]}
					label="Jan"
					indicator="dashed"
				/>
			</Wrapper>
		);
		expect(container.querySelector(".border-dashed")).toBeDefined();
	});

	it("renders nested label for single payload with non-dot indicator", () => {
		render(
			<Wrapper>
				<ChartTooltipContent
					active={true}
					payload={[
						{
							name: "revenue",
							value: 200,
							dataKey: "revenue",
							color: "#00D4FF",
							payload: { fill: "#00D4FF" },
							type: "line",
						} as never,
					]}
					label="Jan"
					indicator="line"
				/>
			</Wrapper>
		);
		expect(screen.getByText("Jan")).toBeDefined();
	});

	it("uses labelFormatter when provided", () => {
		render(
			<Wrapper>
				<ChartTooltipContent
					active={true}
					payload={[
						{
							name: "revenue",
							value: 100,
							dataKey: "revenue",
							color: "#00D4FF",
							payload: { fill: "#00D4FF" },
							type: "line",
						} as never,
					]}
					label="Jan"
					labelFormatter={(val) => `Formatted: ${val}`}
				/>
			</Wrapper>
		);
		expect(screen.getByText("Formatted: Jan")).toBeDefined();
	});

	it("uses formatter when provided", () => {
		render(
			<Wrapper>
				<ChartTooltipContent
					active={true}
					payload={[
						{
							name: "revenue",
							value: 100,
							dataKey: "revenue",
							color: "#00D4FF",
							payload: { fill: "#00D4FF" },
							type: "line",
						} as never,
					]}
					label="Jan"
					formatter={(value, name) => <span>{`${name}: ${value}`}</span>}
				/>
			</Wrapper>
		);
		expect(screen.getByText("revenue: 100")).toBeDefined();
	});

	it("uses nameKey to resolve config", () => {
		render(
			<Wrapper>
				<ChartTooltipContent
					active={true}
					payload={[
						{
							name: "rev",
							value: 100,
							dataKey: "rev",
							color: "#00D4FF",
							payload: { fill: "#00D4FF", category: "revenue" },
							type: "line",
						} as never,
					]}
					label="Jan"
					nameKey="category"
				/>
			</Wrapper>
		);
		expect(screen.getByText("Revenue")).toBeDefined();
	});

	it("uses labelKey to resolve config label", () => {
		render(
			<Wrapper>
				<ChartTooltipContent
					active={true}
					payload={[
						{
							name: "rev",
							value: 100,
							dataKey: "rev",
							color: "#00D4FF",
							payload: { fill: "#00D4FF", cat: "revenue" },
							type: "line",
						} as never,
					]}
					label="Jan"
					labelKey="cat"
				/>
			</Wrapper>
		);
		expect(screen.getByText("Revenue")).toBeDefined();
	});

	it("uses color prop for indicator", () => {
		const { container } = render(
			<Wrapper>
				<ChartTooltipContent
					active={true}
					payload={[
						{
							name: "revenue",
							value: 100,
							dataKey: "revenue",
							color: "#00D4FF",
							payload: { fill: "#00D4FF" },
							type: "line",
						} as never,
					]}
					label="Jan"
					color="#FF0000"
				/>
			</Wrapper>
		);
		const indicator = container.querySelector("[style*='--color-bg']") as HTMLElement;
		expect(indicator?.style.getPropertyValue("--color-bg")).toBe("#FF0000");
	});

	it("renders with icon from config", () => {
		const IconComponent = () => <svg data-testid="custom-icon" />;
		const configWithIcon: ChartConfig = {
			revenue: { label: "Revenue", color: "#00D4FF", icon: IconComponent },
		};
		render(
			<ChartContainer config={configWithIcon}>
				<>
					<ChartTooltipContent
						active={true}
						payload={[
							{
								name: "revenue",
								value: 100,
								dataKey: "revenue",
								color: "#00D4FF",
								payload: { fill: "#00D4FF" },
								type: "line",
							} as never,
						]}
						label="Jan"
					/>
				</>
			</ChartContainer>
		);
		expect(screen.getByTestId("custom-icon")).toBeDefined();
	});

	it("filters out payload items with type none", () => {
		const { container } = render(
			<Wrapper>
				<ChartTooltipContent
					active={true}
					payload={[
						{
							name: "revenue",
							value: 100,
							dataKey: "revenue",
							color: "#00D4FF",
							payload: { fill: "#00D4FF" },
							type: "none",
						} as never,
					]}
					label="Jan"
				/>
			</Wrapper>
		);
		expect(container.querySelector(".text-foreground")).toBeNull();
	});

	it("renders dashed indicator with nestLabel and my-0.5", () => {
		const { container } = render(
			<Wrapper>
				<ChartTooltipContent
					active={true}
					payload={[
						{
							name: "revenue",
							value: 100,
							dataKey: "revenue",
							color: "#00D4FF",
							payload: { fill: "#00D4FF" },
							type: "line",
						} as never,
					]}
					label="Jan"
					indicator="dashed"
				/>
			</Wrapper>
		);
		expect(container.querySelector(".my-0\\.5")).toBeDefined();
	});
});

describe("ChartLegendContent", () => {
	const config: ChartConfig = {
		revenue: { label: "Revenue", color: "#00D4FF" },
		expenses: { label: "Expenses", color: "#FF4422" },
	};

	const Wrapper = ({ children }: { children: React.ReactNode }) => (
		<ChartContainer config={config}>
			<>{children}</>
		</ChartContainer>
	);

	it("returns null when payload is empty", () => {
		const { container } = render(
			<Wrapper>
				<ChartLegendContent payload={[]} />
			</Wrapper>
		);
		expect(container.querySelector(".flex.items-center.justify-center")).toBeNull();
	});

	it("renders legend items", () => {
		render(
			<Wrapper>
				<ChartLegendContent
					payload={[
						{ value: "revenue", dataKey: "revenue", color: "#00D4FF", type: "line" },
						{ value: "expenses", dataKey: "expenses", color: "#FF4422", type: "line" },
					]}
				/>
			</Wrapper>
		);
		expect(screen.getByText("Revenue")).toBeDefined();
		expect(screen.getByText("Expenses")).toBeDefined();
	});

	it("renders with verticalAlign top", () => {
		const { container } = render(
			<Wrapper>
				<ChartLegendContent
					payload={[
						{ value: "revenue", dataKey: "revenue", color: "#00D4FF", type: "line" },
					]}
					verticalAlign="top"
				/>
			</Wrapper>
		);
		expect(container.querySelector(".pb-3")).toBeDefined();
	});

	it("renders with verticalAlign bottom (default)", () => {
		const { container } = render(
			<Wrapper>
				<ChartLegendContent
					payload={[
						{ value: "revenue", dataKey: "revenue", color: "#00D4FF", type: "line" },
					]}
				/>
			</Wrapper>
		);
		expect(container.querySelector(".pt-3")).toBeDefined();
	});

	it("hides icon when hideIcon is true", () => {
		const IconComponent = () => <svg data-testid="legend-icon" />;
		const configWithIcon: ChartConfig = {
			revenue: { label: "Revenue", color: "#00D4FF", icon: IconComponent },
		};
		const { container } = render(
			<ChartContainer config={configWithIcon}>
				<>
					<ChartLegendContent
						payload={[
							{
								value: "revenue",
								dataKey: "revenue",
								color: "#00D4FF",
								type: "line",
							},
						]}
						hideIcon
					/>
				</>
			</ChartContainer>
		);
		expect(container.querySelector("[data-testid='legend-icon']")).toBeNull();
	});

	it("renders icon from config when available", () => {
		const IconComponent = () => <svg data-testid="legend-icon" />;
		const configWithIcon: ChartConfig = {
			revenue: { label: "Revenue", color: "#00D4FF", icon: IconComponent },
		};
		render(
			<ChartContainer config={configWithIcon}>
				<>
					<ChartLegendContent
						payload={[
							{
								value: "revenue",
								dataKey: "revenue",
								color: "#00D4FF",
								type: "line",
							},
						]}
					/>
				</>
			</ChartContainer>
		);
		expect(screen.getByTestId("legend-icon")).toBeDefined();
	});

	it("filters out payload items with type none", () => {
		render(
			<Wrapper>
				<ChartLegendContent
					payload={[
						{ value: "revenue", dataKey: "revenue", color: "#00D4FF", type: "none" },
						{ value: "expenses", dataKey: "expenses", color: "#FF4422", type: "line" },
					]}
				/>
			</Wrapper>
		);
		expect(screen.queryByText("Revenue")).toBeNull();
		expect(screen.getByText("Expenses")).toBeDefined();
	});

	it("uses nameKey to resolve config", () => {
		render(
			<Wrapper>
				<ChartLegendContent
					payload={[
						{
							value: "rev",
							dataKey: "rev",
							color: "#00D4FF",
							type: "line",
						} as never,
					]}
					nameKey="revenue"
				/>
			</Wrapper>
		);
		expect(screen.getByText("Revenue")).toBeDefined();
	});

	it("returns null payload when payload is undefined", () => {
		const { container } = render(
			<Wrapper>
				<ChartLegendContent payload={undefined} />
			</Wrapper>
		);
		expect(container.querySelector(".flex.items-center.justify-center")).toBeNull();
	});
});

describe("getPayloadConfigFromPayload edge cases", () => {
	const config: ChartConfig = {
		revenue: { label: "Revenue", color: "#00D4FF" },
	};

	const Wrapper = ({ children }: { children: React.ReactNode }) => (
		<ChartContainer config={config}>
			<>{children}</>
		</ChartContainer>
	);

	it("handles key found in nested payload.payload", () => {
		render(
			<Wrapper>
				<ChartTooltipContent
					active={true}
					payload={[
						{
							name: "data",
							value: 100,
							dataKey: "data",
							color: "#00D4FF",
							payload: { fill: "#00D4FF", data: "revenue" },
							type: "line",
						} as never,
					]}
					label="Test"
					nameKey="data"
				/>
			</Wrapper>
		);
		expect(screen.getAllByText("Revenue").length).toBeGreaterThanOrEqual(1);
	});

	it("handles key found directly in payload item", () => {
		render(
			<Wrapper>
				<ChartTooltipContent
					active={true}
					payload={[
						{
							name: "rev",
							value: 100,
							dataKey: "rev",
							color: "#00D4FF",
							payload: { fill: "#00D4FF" },
							type: "line",
							category: "revenue",
						} as never,
					]}
					label="Test"
					nameKey="category"
				/>
			</Wrapper>
		);
		expect(screen.getAllByText("Revenue").length).toBeGreaterThanOrEqual(1);
	});
});
