import { createDecipheriv, createHash } from "crypto";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { prisma } from "@assembly-line/db";

export interface AuthUser {
	id: string;
	email: string;
}

@Injectable()
export class SessionService {
	/**
	 * Validates a better-auth session token by querying the session table directly.
	 * Used as fallback for direct API access (e.g. socket connections).
	 */
	async validate(token: string): Promise<AuthUser> {
		const session = await prisma.session.findUnique({
			where: { token },
			include: { user: { select: { id: true, email: true } } },
		});

		if (!session || session.expiresAt < new Date()) {
			throw new UnauthorizedException("Invalid or expired session");
		}

		return session.user;
	}

	/**
	 * Decrypts and validates an AES-256-GCM internal token sent by the Next.js server.
	 * Format: base64url(iv[12] + authTag[16] + ciphertext)
	 * Token is valid for 30 seconds to prevent replay attacks.
	 */
	validateInternalToken(token: string): AuthUser {
		const aesKey = createHash("sha256")
			.update(process.env.INTERNAL_SECRET ?? "")
			.digest();

		let data: { userId: string; iat: number };
		try {
			const buf = Buffer.from(token, "base64url");
			const iv = buf.subarray(0, 12);
			const tag = buf.subarray(12, 28);
			const ciphertext = buf.subarray(28);

			const decipher = createDecipheriv("aes-256-gcm", aesKey, iv);
			decipher.setAuthTag(tag);
			const plain = Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString(
				"utf8"
			);
			data = JSON.parse(plain);
		} catch {
			throw new UnauthorizedException("Invalid internal token");
		}

		if (Date.now() - data.iat > 30_000) throw new UnauthorizedException("Token expired");

		return { id: data.userId, email: "" };
	}
}
