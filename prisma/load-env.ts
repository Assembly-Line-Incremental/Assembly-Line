// Load .env files into process.env using Node's built-in API (Node 20.12+)
// Mirrors Next.js priority order (last wins):
//   .env → .env.local → .env.[NODE_ENV] → .env.[NODE_ENV].local
// This must be imported before any module that validates env vars.
const nodeEnv = process.env.NODE_ENV ?? "development";

for (const file of [".env", ".env.local", `.env.${nodeEnv}`, `.env.${nodeEnv}.local`]) {
	try {
		process.loadEnvFile(file);
	} catch {
		// file doesn't exist, skip
	}
}
