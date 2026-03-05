import { Body, Controller, Headers, HttpCode, Post, UnauthorizedException } from "@nestjs/common";
import { z } from "zod";
import type { ServerToClientEvents } from "@assembly-line/shared";
import { SocketGateway } from "./socket.gateway";

const NotifyBodySchema = z.object({
	userId: z.string(),
	event: z.enum(["game:state", "game:resources", "save:changed"]),
	payload: z.unknown(),
});

@Controller("socket")
export class SocketController {
	constructor(private readonly gateway: SocketGateway) {}

	/** Internal endpoint — called by apps/web tRPC mutations to push events via socket.io. */
	@Post("notify")
	@HttpCode(204)
	notify(@Headers("x-internal-secret") secret: string, @Body() rawBody: unknown): void {
		if (!process.env.INTERNAL_SECRET || secret !== process.env.INTERNAL_SECRET) {
			throw new UnauthorizedException();
		}

		const { userId, event, payload } = NotifyBodySchema.parse(rawBody);
		this.gateway.emitToUser(
			userId,
			event as keyof ServerToClientEvents,
			payload as Parameters<ServerToClientEvents[typeof event]>[0]
		);
	}
}
