describe("env", () => {
	beforeEach(() => {
		vi.resetModules();
		vi.stubEnv("SKIP_ENV_VALIDATION", "1");
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it("should fallback to undefined for NODE_ENV when not set and validation is skipped", async () => {
		vi.stubEnv("NODE_ENV", "");
		delete (process.env as Record<string, string | undefined>).NODE_ENV;
		const { env } = await import("./env");
		expect(env.NODE_ENV).toBeUndefined();
	});

	it("should accept 'production' as NODE_ENV", async () => {
		vi.stubEnv("NODE_ENV", "production");
		const { env } = await import("./env");
		expect(env.NODE_ENV).toBe("production");
	});

	it("should accept 'test' as NODE_ENV", async () => {
		vi.stubEnv("NODE_ENV", "test");
		const { env } = await import("./env");
		expect(env.NODE_ENV).toBe("test");
	});

	it("should accept 'development' as NODE_ENV", async () => {
		vi.stubEnv("NODE_ENV", "development");
		const { env } = await import("./env");
		expect(env.NODE_ENV).toBe("development");
	});

	it("should fallback to localhost URL for NEXT_PUBLIC_URL when not set and validation is skipped", async () => {
		vi.stubEnv("NEXT_PUBLIC_URL", "");
		delete (process.env as Record<string, string | undefined>).NEXT_PUBLIC_URL;
		const { env } = await import("./env");
		expect(env.NEXT_PUBLIC_URL).toBe("http://localhost:3000");
	});

	it("should use NEXT_PUBLIC_URL from environment", async () => {
		vi.stubEnv("NEXT_PUBLIC_URL", "https://example.com");
		const { env } = await import("./env");
		expect(env.NEXT_PUBLIC_URL).toBe("https://example.com");
	});

	it("should treat empty string as undefined when validation is skipped", async () => {
		vi.stubEnv("NEXT_PUBLIC_URL", "");
		const { env } = await import("./env");
		expect(env.NEXT_PUBLIC_URL).toBeUndefined();
	});

	it("should fallback to undefined for DATABASE_URL when not set and validation is skipped", async () => {
		vi.stubEnv("DATABASE_URL", "");
		delete (process.env as Record<string, string | undefined>).DATABASE_URL;
		const { env } = await import("./env");
		expect(env.DATABASE_URL).toBeUndefined();
	});

	it("should use DATABASE_URL from environment", async () => {
		vi.stubEnv("DATABASE_URL", "postgresql://localhost:5432/mydb");
		const { env } = await import("./env");
		expect(env.DATABASE_URL).toBe("postgresql://localhost:5432/mydb");
	});

	it("should fallback to undefined for SENTRY_AUTH_TOKEN when not set and validation is skipped", async () => {
		vi.stubEnv("SENTRY_AUTH_TOKEN", "");
		delete (process.env as Record<string, string | undefined>).SENTRY_AUTH_TOKEN;
		const { env } = await import("./env");
		expect(env.SENTRY_AUTH_TOKEN).toBeUndefined();
	});

	it("should use SENTRY_AUTH_TOKEN from environment", async () => {
		vi.stubEnv("SENTRY_AUTH_TOKEN", "sntrx_abc123");
		const { env } = await import("./env");
		expect(env.SENTRY_AUTH_TOKEN).toBe("sntrx_abc123");
	});

	it("should fallback to undefined for NEXT_PUBLIC_SENTRY_DSN when not set and validation is skipped", async () => {
		vi.stubEnv("NEXT_PUBLIC_SENTRY_DSN", "");
		delete (process.env as Record<string, string | undefined>).NEXT_PUBLIC_SENTRY_DSN;
		const { env } = await import("./env");
		expect(env.NEXT_PUBLIC_SENTRY_DSN).toBeUndefined();
	});

	it("should use NEXT_PUBLIC_SENTRY_DSN from environment", async () => {
		vi.stubEnv("NEXT_PUBLIC_SENTRY_DSN", "https://examplePublicKey@o0.ingest.sentry.io/0");
		const { env } = await import("./env");
		expect(env.NEXT_PUBLIC_SENTRY_DSN).toBe("https://examplePublicKey@o0.ingest.sentry.io/0");
	});

	it("should skip validation when SKIP_ENV_VALIDATION is set", async () => {
		vi.stubEnv("SKIP_ENV_VALIDATION", "1");
		vi.stubEnv("NODE_ENV", "invalid_value");
		const { env } = await import("./env");
		expect(env.NODE_ENV).toBe("invalid_value");
	});

	it("should use VERCEL_URL with https prefix when VERCEL_URL is set", async () => {
		vi.stubEnv("VERCEL_URL", "my-app.vercel.app");
		const { env } = await import("./env");
		expect(env.NEXT_PUBLIC_URL).toBe("https://my-app.vercel.app");
	});
});
