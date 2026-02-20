import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "@/env";

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
	adapter: PrismaPg | undefined;
};

const adapter = globalForPrisma.adapter ?? new PrismaPg({ connectionString: env.DATABASE_URL });

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
	globalForPrisma.adapter = adapter;
}
