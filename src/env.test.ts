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

	it("should fallback to undefined for NEXT_PUBLIC_URL when not set and validation is skipped", async () => {
		vi.stubEnv("NEXT_PUBLIC_URL", "");
		delete (process.env as Record<string, string | undefined>).NEXT_PUBLIC_URL;
		const { env } = await import("./env");
		expect(env.NEXT_PUBLIC_URL).toBeUndefined();
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

	it("should skip validation when SKIP_ENV_VALIDATION is set", async () => {
		vi.stubEnv("SKIP_ENV_VALIDATION", "1");
		vi.stubEnv("NODE_ENV", "invalid_value");
		const { env } = await import("./env");
		expect(env.NODE_ENV).toBe("invalid_value");
	});
});
