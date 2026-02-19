import { describe, it, expect } from "vitest";
import { FEATURES, ERAS, PIPELINE_STEPS, STATS } from "./constants";

describe("constants", () => {
	describe("FEATURES", () => {
		it("has 6 features", () => {
			expect(FEATURES).toHaveLength(6);
		});

		it("each feature has required properties", () => {
			for (const feature of FEATURES) {
				expect(feature).toHaveProperty("icon");
				expect(feature).toHaveProperty("title");
				expect(feature).toHaveProperty("description");
				expect(feature).toHaveProperty("color");
			}
		});
	});

	describe("ERAS", () => {
		it("has 6 eras", () => {
			expect(ERAS).toHaveLength(6);
		});

		it("eras are numbered 1 through 6", () => {
			expect(ERAS.map((e) => e.era)).toEqual([1, 2, 3, 4, 5, 6]);
		});

		it("each era has required properties", () => {
			for (const era of ERAS) {
				expect(era).toHaveProperty("name");
				expect(era).toHaveProperty("era");
				expect(era).toHaveProperty("description");
				expect(era).toHaveProperty("color");
				expect(era).toHaveProperty("icon");
			}
		});
	});

	describe("PIPELINE_STEPS", () => {
		it("has 5 steps", () => {
			expect(PIPELINE_STEPS).toHaveLength(5);
		});

		it("steps are numbered 01 through 05", () => {
			expect(PIPELINE_STEPS.map((s) => s.step)).toEqual(["01", "02", "03", "04", "05"]);
		});

		it("each step has required properties", () => {
			for (const step of PIPELINE_STEPS) {
				expect(step).toHaveProperty("step");
				expect(step).toHaveProperty("title");
				expect(step).toHaveProperty("desc");
				expect(step).toHaveProperty("icon");
				expect(step).toHaveProperty("color");
			}
		});
	});

	describe("STATS", () => {
		it("has 4 stats", () => {
			expect(STATS).toHaveLength(4);
		});

		it("each stat has required properties", () => {
			for (const stat of STATS) {
				expect(stat).toHaveProperty("label");
				expect(stat).toHaveProperty("value");
				expect(stat).toHaveProperty("icon");
			}
		});
	});
});
