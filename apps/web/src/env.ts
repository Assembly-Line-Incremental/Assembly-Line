import { createEnv } from "@t3-oss/env-nextjs";
import z from "zod";

const LOCALHOST_URL = "http://localhost:3000";

export const env = createEnv({
	server: {
		DATABASE_URL: z.string(),
		NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
		SENTRY_AUTH_TOKEN: z.string(),
		BETTER_AUTH_SECRET: z.string(),
		GOOGLE_CLIENT_ID: z.string().optional(),
		GOOGLE_CLIENT_SECRET: z.string().optional(),
		GITHUB_CLIENT_ID: z.string().optional(),
		GITHUB_CLIENT_SECRET: z.string().optional(),
		DISCORD_CLIENT_ID: z.string().optional(),
		DISCORD_CLIENT_SECRET: z.string().optional(),
		TWITCH_CLIENT_ID: z.string().optional(),
		TWITCH_CLIENT_SECRET: z.string().optional(),
		/** Internal URL of the NestJS API (server-side only). */
		API_URL: z.string().default("http://localhost:3001"),
		/** Shared secret for server-to-server calls between apps/web and apps/api. */
		INTERNAL_SECRET: z.string(),
	},

	client: {
		NEXT_PUBLIC_SENTRY_DSN: z.string(),
		NEXT_PUBLIC_URL: z.string().default(LOCALHOST_URL),
		/** Public URL of the NestJS API (used by socket.io-client in the browser). */
		NEXT_PUBLIC_API_URL: z.string().default("http://localhost:3001"),
		/** Central auth server URL. Set on previews to point to prod. Defaults to current origin. */
		NEXT_PUBLIC_AUTH_URL: z.string().optional(),
	},

	experimental__runtimeEnv: {
		NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
		NEXT_PUBLIC_URL: process.env.VERCEL_URL
			? `https://${process.env.VERCEL_URL}`
			: (process.env.NEXT_PUBLIC_URL ?? LOCALHOST_URL),
		NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001",
		NEXT_PUBLIC_AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL,
	},

	skipValidation: !!process.env.SKIP_ENV_VALIDATION,

	emptyStringAsUndefined: true,
});
