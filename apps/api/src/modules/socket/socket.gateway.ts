import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	WebSocketGateway,
	WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { prisma } from "@assembly-line/db";
import type { ClientToServerEvents, ServerToClientEvents } from "@assembly-line/shared";
import { SessionService } from "../session/session.service";

type TypedServer = Server<ClientToServerEvents, ServerToClientEvents>;
type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

@WebSocketGateway({
	cors: { origin: process.env.WEB_URL ?? "http://localhost:3000" },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server!: TypedServer;

	/** userId → set of active sockets (multi-tab support) */
	private readonly userSockets = new Map<string, Set<TypedSocket>>();

	constructor(private readonly sessions: SessionService) {}

	async handleConnection(client: TypedSocket): Promise<void> {
		const token = client.handshake.auth?.token as string | undefined;
		if (!token) {
			client.disconnect();
			return;
		}

		try {
			const user = await this.sessions.validate(token);
			client.data.userId = user.id;

			// Join the user's room — used by emitToUser for cross-instance broadcasting via Redis adapter.
			await client.join(`user:${user.id}`);

			// Track sockets locally for instance-local presence detection.
			let sockets = this.userSockets.get(user.id);
			if (!sockets) {
				sockets = new Set();
				this.userSockets.set(user.id, sockets);
			}
			sockets.add(client);

			await prisma.user.update({
				where: { id: user.id },
				data: { presenceStatus: "ONLINE", lastSeenAt: new Date() },
			});
		} catch {
			client.disconnect();
		}
	}

	async handleDisconnect(client: TypedSocket): Promise<void> {
		const userId = client.data.userId as string | undefined;
		if (!userId) return;

		const sockets = this.userSockets.get(userId);
		if (sockets) {
			sockets.delete(client);
			if (sockets.size === 0) {
				this.userSockets.delete(userId);
				await prisma.user.update({
					where: { id: userId },
					data: { presenceStatus: "OFFLINE", lastSeenAt: new Date() },
				});
			}
		}
	}

	/**
	 * Emit a typed event to all sockets belonging to a user.
	 * Uses socket.io rooms so it works transparently with both the in-memory adapter
	 * and the Redis adapter (cross-instance broadcasting).
	 */
	emitToUser<E extends keyof ServerToClientEvents>(
		userId: string,
		event: E,
		payload: Parameters<ServerToClientEvents[E]>[0]
	): void {
		(this.server.to(`user:${userId}`) as any).emit(event, payload);
	}
}
