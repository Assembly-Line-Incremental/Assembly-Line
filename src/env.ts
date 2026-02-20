import { createEnv } from "@t3-oss/env-nextjs";
import z from "zod";

const LOCALHOST_URL = "http://localhost:3000";

export const env = createEnv({
	server: {
		DATABASE_URL: z.string(),
		NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
		SENTRY_AUTH_TOKEN: z.string(),
		BETTER_AUTH_SECRET: z.string(),
	},

	client: {
		NEXT_PUBLIC_SENTRY_DSN: z.string(),
		NEXT_PUBLIC_URL: z.string().default(LOCALHOST_URL),
	},

	experimental__runtimeEnv: {
		NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
		NEXT_PUBLIC_URL: process.env.VERCEL_URL
			? `https://${process.env.VERCEL_URL}`
			: (process.env.NEXT_PUBLIC_URL ?? LOCALHOST_URL),
	},

	skipValidation: !!process.env.SKIP_ENV_VALIDATION,

	emptyStringAsUndefined: true,
});
