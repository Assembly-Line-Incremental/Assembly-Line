import { createEnv } from "@t3-oss/env-nextjs";
import z from "zod";

export const env = createEnv({
	server: {
		DATABASE_URL: z.string(),
		NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
		SENTRY_AUTH_TOKEN: z.string(),
	},

	client: {
		NEXT_PUBLIC_SENTRY_DSN: z.string(),
		NEXT_PUBLIC_URL: z.string().default("http://localhost:3000"),
	},

	experimental__runtimeEnv: {
		NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
		NEXT_PUBLIC_URL: process.env.VERCEL_URL
			? `https://${process.env.VERCEL_URL}`
			: process.env.NEXT_PUBLIC_URL,
	},

	skipValidation: !!process.env.SKIP_ENV_VALIDATION,

	emptyStringAsUndefined: true,
});
