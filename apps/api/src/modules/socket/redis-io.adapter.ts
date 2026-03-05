import { IoAdapter } from "@nestjs/platform-socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { Redis } from "ioredis";
import type { ServerOptions } from "socket.io";

/**
 * Socket.io adapter that uses Redis pub/sub for cross-instance broadcasting.
 * Drop-in replacement for the default IoAdapter — only used when REDIS_URL is set.
 *
 * Presence tracking (ONLINE/OFFLINE) remains instance-local.
 * When horizontally scaling with redlock (Phase 6), migrate presence to a Redis counter.
 */
export class RedisIoAdapter extends IoAdapter {
	private adapterConstructor!: ReturnType<typeof createAdapter>;

	async connectToRedis(url: string): Promise<void> {
		const pubClient = new Redis(url, { lazyConnect: true });
		const subClient = pubClient.duplicate();

		await Promise.all([pubClient.connect(), subClient.connect()]);

		this.adapterConstructor = createAdapter(pubClient, subClient);
	}

	createIOServer(port: number, options?: ServerOptions) {
		const server = super.createIOServer(port, options);
		server.adapter(this.adapterConstructor);
		return server;
	}
}
