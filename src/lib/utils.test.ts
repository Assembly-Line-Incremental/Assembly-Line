import { cn } from "./utils";

describe("cn", () => {
	it("should return an empty string when called with no arguments", () => {
		expect(cn()).toBe("");
	});

	it("should return a single class name", () => {
		expect(cn("text-red-500")).toBe("text-red-500");
	});

	it("should merge multiple class names", () => {
		expect(cn("text-red-500", "bg-blue-500")).toBe("text-red-500 bg-blue-500");
	});

	it("should handle conditional classes", () => {
		expect(cn("base", false && "hidden", "visible")).toBe("base visible");
	});

	it("should handle undefined and null values", () => {
		expect(cn("base", undefined, null, "end")).toBe("base end");
	});

	it("should merge conflicting Tailwind classes (last wins)", () => {
		expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
	});

	it("should merge conflicting padding classes", () => {
		expect(cn("p-4", "p-2")).toBe("p-2");
	});

	it("should handle object syntax from clsx", () => {
		expect(cn({ "text-red-500": true, "bg-blue-500": false })).toBe("text-red-500");
	});

	it("should handle array syntax from clsx", () => {
		expect(cn(["text-red-500", "bg-blue-500"])).toBe("text-red-500 bg-blue-500");
	});

	it("should handle mixed inputs", () => {
		expect(cn("base", ["arr-class"], { "obj-class": true })).toBe("base arr-class obj-class");
	});
});
