/**
 * Server-side HTTP client for the NestJS API (apps/api).
 * Authenticates via a signed x-user-id header (HMAC-SHA256 with INTERNAL_SECRET)
 * so NestJS can trust the userId without a DB session lookup.
 * Throws TRPCError on non-2xx responses — safe to use directly in tRPC procedures.
 */

import { createCipheriv, createHash, randomBytes } from "crypto";
import { TRPCError } from "@trpc/server";

const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:3001";

// Derive a 32-byte AES-256 key from the secret
const AES_KEY = createHash("sha256")
	.update(process.env.INTERNAL_SECRET ?? "")
	.digest();

function toTRPCCode(status: number): TRPCError["code"] {
	if (status === 401) return "UNAUTHORIZED";
	if (status === 403) return "FORBIDDEN";
	if (status === 404) return "NOT_FOUND";
	if (status === 400) return "BAD_REQUEST";
	return "INTERNAL_SERVER_ERROR";
}

/**
 * Encrypts {userId, iat} with AES-256-GCM.
 * Output: base64url(iv[12] + authTag[16] + ciphertext)
 * The auth tag guarantees integrity — no separate HMAC needed.
 */
function makeInternalToken(userId: string): string {
	const iv = randomBytes(12);
	const cipher = createCipheriv("aes-256-gcm", AES_KEY, iv);
	const plain = JSON.stringify({ userId, iat: Date.now() });
	const ciphertext = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
	const tag = cipher.getAuthTag();
	return Buffer.concat([iv, tag, ciphertext]).toString("base64url");
}

export async function apiFetch<T = void>(
	path: string,
	userId: string,
	init?: RequestInit
): Promise<T> {
	let res: Response;
	try {
		res = await fetch(`${API_URL}${path}`, {
			...init,
			headers: {
				"Content-Type": "application/json",
				"x-internal-token": makeInternalToken(userId),
				...init?.headers,
			},
		});
	} catch (err) {
		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: `API unreachable at ${API_URL}${path}: ${(err as Error).message}`,
		});
	}

	if (!res.ok) {
		const body = await res.json().catch(() => null);
		throw new TRPCError({
			code: toTRPCCode(res.status),
			message: (body as { message?: string })?.message ?? res.statusText,
		});
	}

	if (res.status === 204) return undefined as T;
	return res.json() as Promise<T>;
}
