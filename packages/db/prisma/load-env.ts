// Load .env files into process.env using Node's built-in API (Node 20.12+)
// Looks in packages/db/, monorepo root and apps/web (last wins).
// This must be imported before any module that validates env vars.
import path from "path";

const nodeEnv = process.env.NODE_ENV ?? "development";

const roots = [
	path.resolve(import.meta.dirname, "../../.."), // monorepo root
	path.resolve(import.meta.dirname, "../../../apps/web"), // apps/web
	path.resolve(import.meta.dirname, ".."), // packages/db (local overrides)
];

for (const root of roots) {
	for (const file of [".env", ".env.local", `.env.${nodeEnv}`, `.env.${nodeEnv}.local`]) {
		try {
			process.loadEnvFile(path.join(root, file));
		} catch {
			// file doesn't exist, skip
		}
	}
}
