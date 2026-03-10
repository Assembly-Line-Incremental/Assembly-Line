import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { headers } from "next/headers";
import geoip from "geoip-lite";
import { createTRPCRouter, protectedProcedure, baseProcedure } from "../init";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// Simple in-memory rate limiter for public endpoints (per IP, resets every minute)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
	const now = Date.now();
	const entry = rateLimitStore.get(key);
	if (!entry || now > entry.resetAt) {
		rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
		return true;
	}
	if (entry.count >= limit) return false;
	entry.count++;
	return true;
}

export const userRouter = createTRPCRouter({
	/**
	 * Current authenticated user's full profile.
	 */
	getMe: protectedProcedure.query(async ({ ctx }) => {
		return prisma.user.findUniqueOrThrow({
			where: { id: ctx.auth.user.id },
			select: {
				id: true,
				name: true,
				email: true,
				image: true,
				createdAt: true,
				emailVerified: true,
				presenceStatus: true,
				isPublic: true,
				supporter: { select: { tier: true, isActive: true } },
				achievements: { select: { slug: true, unlockedAt: true } },
				gameSaves: {
					select: {
						id: true,
						slot: true,
						name: true,
						currentEra: true,
						prestigeCount: true,
						isHardcore: true,
						createdAt: true,
					},
					orderBy: { slot: "asc" },
				},
				_count: { select: { gameSaves: true } },
			},
		});
	}),

	/**
	 * List the current user's sessions with geo-resolved city.
	 * Raw IP addresses are never sent to the client.
	 */
	listSessions: protectedProcedure.query(async ({ ctx }) => {
		const res = await auth.api.listSessions({
			headers: await headers(),
		});
		const currentToken = ctx.auth.session.token;
		const regionNames = new Intl.DisplayNames(["fr"], { type: "region" });
		const isLocalIp = (ip: string) =>
			ip === "127.0.0.1" || /^0*:*1$|^::$|^0+(:0+)*(:0+)?$/.test(ip);
		return (res ?? []).map((s) => {
			const local = s.ipAddress ? isLocalIp(s.ipAddress) : false;
			const geo = !local && s.ipAddress ? geoip.lookup(s.ipAddress) : null;
			return {
				id: s.id,
				isCurrent: s.token === currentToken,
				userAgent: s.userAgent ?? null,
				city: local ? "Localhost" : geo?.city || null,
				country: local ? null : geo?.country ? (regionNames.of(geo.country) ?? null) : null,
				createdAt: s.createdAt,
			};
		});
	}),

	/**
	 * Check whether a display name is available (used during registration).
	 * Rate-limited to 30 req/min per IP.
	 */
	checkNameAvailable: baseProcedure
		.input(z.object({ name: z.string().trim().min(1).max(20) }))
		.query(async ({ input }) => {
			const hdrs = await headers();
			const ip =
				hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ??
				hdrs.get("x-real-ip") ??
				"unknown";
			if (!checkRateLimit(`checkName:${ip}`, 30, 60_000)) {
				throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Trop de requêtes." });
			}
			const existing = await prisma.user.findUnique({
				where: { name: input.name.toLowerCase() },
			});
			return { available: !existing };
		}),

	/**
	 * Public profile of another user by display name.
	 * Returns null if user not found. Returns minimal info if profile is private.
	 */
	getPublicProfile: baseProcedure
		.input(z.object({ username: z.string() }))
		.query(async ({ input }) => {
			const user = await prisma.user.findUnique({
				where: { name: input.username.toLowerCase() },
				select: {
					id: true,
					name: true,
					image: true,
					createdAt: true,
					presenceStatus: true,
					isPublic: true,
					supporter: { select: { tier: true, isActive: true } },
					achievements: { select: { slug: true, unlockedAt: true } },
					gameSaves: {
						select: {
							id: true,
							slot: true,
							name: true,
							currentEra: true,
							prestigeCount: true,
							isHardcore: true,
							createdAt: true,
						},
						orderBy: { slot: "asc" },
					},
					_count: { select: { gameSaves: true } },
				},
			});

			if (!user) return null;
			if (!user.isPublic) {
				return {
					id: user.id,
					name: user.name,
					isPublic: false as const,
					image: null,
					createdAt: user.createdAt,
					presenceStatus: user.presenceStatus,
					supporter: null,
					achievements: [],
					gameSaves: [],
					_count: { gameSaves: 0 },
				};
			}
			return user;
		}),

	/**
	 * Update display name and/or profile visibility.
	 */
	updateProfile: protectedProcedure
		.input(
			z.object({
				name: z
					.string()
					.trim()
					.min(3)
					.max(20)
					.regex(/^[a-zA-Z0-9_-]+$/)
					.optional(),
				isPublic: z.boolean().optional(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			try {
				return await prisma.user.update({
					where: { id: ctx.auth.user.id },
					data: {
						...input,
						...(input.name !== undefined && { name: input.name.toLowerCase() }),
					},
					select: { id: true, name: true, isPublic: true },
				});
			} catch (err: unknown) {
				if (
					typeof err === "object" &&
					err !== null &&
					"code" in err &&
					(err as { code: string }).code === "P2002"
				) {
					throw new TRPCError({
						code: "CONFLICT",
						message: "Ce pseudo est déjà pris.",
					});
				}
				throw err;
			}
		}),

	/**
	 * Update the user's avatar image URL (from Uploadthing upload or null to reset).
	 */
	updateAvatar: protectedProcedure
		.input(
			z.object({
				image: z
					.string()
					.url()
					.refine((val) => {
						try {
							const url = new URL(val);
							const allowed = [
								"ufs.sh",
								"utfs.io",
								"uploadthing.com",
								"api.dicebear.com",
							];
							return allowed.some(
								(d) => url.hostname === d || url.hostname.endsWith(`.${d}`)
							);
						} catch {
							return false;
						}
					}, "Domaine d'avatar non autorisé")
					.nullable(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			return prisma.user.update({
				where: { id: ctx.auth.user.id },
				data: { image: input.image },
				select: { id: true, image: true },
			});
		}),

	/**
	 * Change password via better-auth.
	 */
	changePassword: protectedProcedure
		.input(
			z.object({
				currentPassword: z.string().min(1),
				newPassword: z.string().min(8).max(100),
			})
		)
		.mutation(async ({ input }) => {
			try {
				await auth.api.changePassword({
					body: {
						currentPassword: input.currentPassword,
						newPassword: input.newPassword,
						revokeOtherSessions: false,
					},
					headers: await headers(),
				});
			} catch (err: unknown) {
				const status =
					typeof err === "object" && err !== null && "status" in err
						? (err as { status: unknown }).status
						: null;
				if (status === 400 || status === 401) {
					throw new TRPCError({
						code: "UNAUTHORIZED",
						message: "Mot de passe actuel incorrect.",
					});
				}
				console.error("[changePassword]", err);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Une erreur est survenue lors du changement de mot de passe.",
				});
			}
		}),

	/**
	 * Export all personal data for the current user (RGPD Article 20).
	 * Returns a JSON-serializable object with all user data.
	 */
	exportData: protectedProcedure.query(async ({ ctx }) => {
		const userId = ctx.auth.user.id;
		const user = await prisma.user.findUniqueOrThrow({
			where: { id: userId },
			select: {
				name: true,
				email: true,
				image: true,
				createdAt: true,
				updatedAt: true,
				isPublic: true,
				emailVerified: true,
				presenceStatus: true,
				sessions: {
					select: {
						createdAt: true,
						expiresAt: true,
						userAgent: true,
						// IP not exported — CNIL: not necessary for portability
					},
				},
				achievements: {
					select: { slug: true, unlockedAt: true },
				},
				gameSaves: {
					select: {
						slot: true,
						name: true,
						currentEra: true,
						prestigeCount: true,
						isHardcore: true,
						createdAt: true,
						resources: { select: { type: true, amount: true } },
					},
				},
				supporter: {
					select: { tier: true, isActive: true, startedAt: true, endedAt: true },
				},
			},
		});
		return user;
	}),

	/**
	 * Delete account. Requires password verification.
	 * Cascade delete handles all related data.
	 */
	deleteAccount: protectedProcedure
		.input(z.object({ password: z.string().min(1) }))
		.mutation(async ({ input }) => {
			try {
				await auth.api.deleteUser({
					body: { password: input.password },
					headers: await headers(),
				});
			} catch (err: unknown) {
				const status =
					typeof err === "object" && err !== null && "status" in err
						? (err as { status: unknown }).status
						: null;
				if (status === 400 || status === 401) {
					throw new TRPCError({
						code: "UNAUTHORIZED",
						message: "Mot de passe incorrect.",
					});
				}
				console.error("[deleteAccount]", err);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Une erreur est survenue lors de la suppression du compte.",
				});
			}
		}),

	/**
	 * Revoke a specific session by its ID.
	 * Only sessions belonging to the current user can be revoked.
	 */
	revokeSession: protectedProcedure
		.input(z.object({ sessionId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const deleted = await prisma.session.deleteMany({
				where: { id: input.sessionId, userId: ctx.auth.user.id },
			});
			if (deleted.count === 0) {
				throw new TRPCError({ code: "NOT_FOUND", message: "Session introuvable." });
			}
		}),
});
