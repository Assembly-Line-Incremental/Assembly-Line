import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
	adapter: PrismaPg | undefined;
};

const connectionString = process.env.DATABASE_URL!;

const adapter = globalForPrisma.adapter ?? new PrismaPg({ connectionString });

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
	globalForPrisma.adapter = adapter;
}
