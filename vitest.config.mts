import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
	plugins: [react()],
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: ["./vitest.setup.ts"],
		include: ["**/*.test.{ts,tsx}"],
		coverage: {
			provider: "istanbul",
			cleanOnRerun: false,
			reporter: ["text", "text-summary", "html", "lcov"],
			include: ["src/**/*.{ts,tsx}"],
			exclude: [
				"src/**/*.test.{ts,tsx}",
				"src/**/*.d.ts",
				"**/layout.tsx",
				"**/loading.tsx",
				"**/error.tsx",
				"**/not-found.tsx",
				"src/**/index.ts", // barrel files
			],
			thresholds: {
				statements: 100,
				branches: 100,
				functions: 100,
				lines: 100,
			},
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./"),
		},
	},
});
