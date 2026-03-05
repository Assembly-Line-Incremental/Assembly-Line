if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL is not set");
}

export const env = {
	DATABASE_URL: process.env.DATABASE_URL,
};
