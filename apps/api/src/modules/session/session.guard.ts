import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { SessionService } from "./session.service";

@Injectable()
export class SessionGuard implements CanActivate {
	constructor(private readonly sessionService: SessionService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<FastifyRequest>();
		const user = await this.authenticate(request);
		(request as FastifyRequest & { user: typeof user }).user = user;
		return true;
	}

	private async authenticate(request: FastifyRequest) {
		// Prefer signed internal token (Next.js server-to-server calls via INTERNAL_SECRET)
		const internalToken = request.headers["x-internal-token"] as string | undefined;
		if (internalToken) {
			return this.sessionService.validateInternalToken(internalToken);
		}

		// Fall back to cookie-based session (direct API access / socket)
		const token = this.extractToken(request);
		return this.sessionService.validate(token);
	}

	private extractToken(request: FastifyRequest): string {
		const cookie = (request as FastifyRequest & { cookies?: Record<string, string> }).cookies?.[
			"better-auth.session_token"
		];
		if (cookie) return cookie;

		const authHeader = request.headers.authorization;
		if (authHeader?.startsWith("Bearer ")) return authHeader.slice(7);

		const headerToken = request.headers["x-session-token"] as string | undefined;
		if (headerToken) return headerToken;

		throw new UnauthorizedException("No authentication provided");
	}
}
