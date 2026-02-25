import "../../../prisma/load-env";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/db";
import { ResourceType } from "@/generated/prisma/client";
import { env } from "@/env";

export const auth = betterAuth({
	baseURL: env.NEXT_PUBLIC_URL,
	secret: env.BETTER_AUTH_SECRET,
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
	},
	plugins: [],
	databaseHooks: {
		user: {
			create: {
				after: async (user) => {
					try {
						const save = await prisma.gameSave.upsert({
							where: { userId_slot: { userId: user.id, slot: 1 } },
							create: { userId: user.id, slot: 1, name: "Factory 1" },
							update: {},
						});
						await prisma.resource.createMany({
							data: Object.values(ResourceType).map((type) => ({
								saveId: save.id,
								type,
							})),
							skipDuplicates: true,
						});
					} catch (err) {
						console.error("[auth] Failed to seed game save for user", user.id, err);
					}
				},
			},
		},
	},
});
