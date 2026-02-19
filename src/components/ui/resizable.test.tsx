import { describe, it, expect, vi, beforeAll } from "vitest";
import { render } from "@testing-library/react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "./resizable";

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

describe("Resizable", () => {
	it("renders panel group with panels", () => {
		const { container } = render(
			<ResizablePanelGroup orientation="horizontal">
				<ResizablePanel>Panel 1</ResizablePanel>
				<ResizableHandle />
				<ResizablePanel>Panel 2</ResizablePanel>
			</ResizablePanelGroup>
		);
		expect(container.querySelector("[data-panel-group]")).toBeDefined();
	});

	it("renders handle with grip when withHandle is true", () => {
		const { container } = render(
			<ResizablePanelGroup orientation="horizontal">
				<ResizablePanel>Panel 1</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel>Panel 2</ResizablePanel>
			</ResizablePanelGroup>
		);
		expect(container.querySelector("[data-slot='resizable-handle'] svg")).toBeDefined();
	});

	it("renders handle without grip when withHandle is false", () => {
		const { container } = render(
			<ResizablePanelGroup orientation="horizontal">
				<ResizablePanel>Panel 1</ResizablePanel>
				<ResizableHandle />
				<ResizablePanel>Panel 2</ResizablePanel>
			</ResizablePanelGroup>
		);
		expect(container.querySelector("[data-slot='resizable-handle'] svg")).toBeNull();
	});
});
