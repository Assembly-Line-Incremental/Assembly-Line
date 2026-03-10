import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/db";
import { ResourceType } from "@assembly-line/db";
import { env } from "@/env";

export const auth = betterAuth({
	baseURL: env.NEXT_PUBLIC_URL,
	trustedOrigins: [env.NEXT_PUBLIC_URL, "https://*.assembly-line.fr"],
	secret: env.BETTER_AUTH_SECRET,
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	advanced: {
		crossSubDomainCookies: {
			enabled: env.NODE_ENV === "production",
			domain: env.NEXT_PUBLIC_URL.includes("localhost")
				? undefined
				: `.${new URL(env.NEXT_PUBLIC_URL).hostname.split(".").slice(-2).join(".")}`,
		},
	},
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
	},
	user: {
		deleteUser: {
			enabled: true,
		},
	},
	account: {
		accountLinking: {
			allowDifferentEmails: true,
		},
	},
	socialProviders: {
		...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
			? {
					google: {
						enabled: true,
						clientId: env.GOOGLE_CLIENT_ID,
						clientSecret: env.GOOGLE_CLIENT_SECRET,
					},
				}
			: {}),
		...(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET
			? {
					github: {
						enabled: true,
						clientId: env.GITHUB_CLIENT_ID,
						clientSecret: env.GITHUB_CLIENT_SECRET,
					},
				}
			: {}),
		...(env.DISCORD_CLIENT_ID && env.DISCORD_CLIENT_SECRET
			? {
					discord: {
						enabled: true,
						clientId: env.DISCORD_CLIENT_ID,
						clientSecret: env.DISCORD_CLIENT_SECRET,
					},
				}
			: {}),
		...(env.TWITCH_CLIENT_ID && env.TWITCH_CLIENT_SECRET
			? {
					twitch: {
						enabled: true,
						clientId: env.TWITCH_CLIENT_ID,
						clientSecret: env.TWITCH_CLIENT_SECRET,
					},
				}
			: {}),
	},
	plugins: [],
	databaseHooks: {
		user: {
			create: {
				before: async (user) => {
					// Sanitize names from OAuth providers (may contain spaces, dots, "@", etc.)
					const raw = (
						user.name
							.trim()
							.replace(/[^a-zA-Z0-9_-]/g, "_")
							.replace(/_+/g, "_")
							.replace(/^_|_$/, "")
							.slice(0, 20) || "player"
					).toLowerCase();
					const sanitized = raw.length < 3 ? raw.padEnd(3, "0") : raw;

					// Name is already valid (email registration) — don't touch it
					if (sanitized === user.name) return;

					// Check if sanitized name is free
					const existing = await prisma.user.findUnique({ where: { name: sanitized } });
					if (!existing) return { data: { ...user, name: sanitized } };

					// Find a unique name with a number suffix
					const base = sanitized.slice(0, 17);
					for (let i = 1; i <= 99; i++) {
						const candidate = `${base}${i}`;
						const conflict = await prisma.user.findUnique({
							where: { name: candidate },
						});
						if (!conflict) return { data: { ...user, name: candidate } };
					}

					// Last resort
					return {
						data: {
							...user,
							name: `${sanitized.slice(0, 12)}${Date.now().toString(36).slice(-6)}`,
						},
					};
				},
				after: async (user) => {
					try {
						await prisma.$transaction(async (tx) => {
							const save = await tx.gameSave.upsert({
								where: { userId_slot: { userId: user.id, slot: 1 } },
								create: { userId: user.id, slot: 1, name: "Factory 1" },
								update: {},
							});
							await tx.resource.createMany({
								data: Object.values(ResourceType).map((type) => ({
									saveId: save.id,
									type,
								})),
								skipDuplicates: true,
							});
						});
					} catch (err) {
						console.error("[auth] Failed to seed game save for user", user.id, err);
					}
				},
			},
		},
	},
});
