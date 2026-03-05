import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
	// Apply Next.js rules only to apps/web source files
	...[...nextVitals, ...nextTs].map((config) => ({
		...config,
		files: config.files ?? ["apps/web/**/*.{ts,tsx,js,jsx,mjs}"],
	})),
	prettier,
	globalIgnores([
		"apps/web/.next/**",
		"apps/api/dist/**",
		"packages/db/src/generated/**",
		"**/node_modules/**",
		"out/**",
		"build/**",
	]),
]);

export default eslintConfig;
