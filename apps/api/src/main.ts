import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { ZodValidationPipe } from "nestjs-zod";
import fastifyCookie from "@fastify/cookie";
import { AppModule } from "./app.module";
import { RedisIoAdapter } from "./modules/socket/redis-io.adapter";

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

	await app.register(fastifyCookie as any);

	// Use Redis adapter when REDIS_URL is set (production/staging); fall back to in-memory for local dev.
	const redisUrl = process.env.REDIS_URL;
	if (redisUrl) {
		const redisAdapter = new RedisIoAdapter(app);
		await redisAdapter.connectToRedis(redisUrl);
		app.useWebSocketAdapter(redisAdapter);
		console.log("Socket.io: Redis adapter enabled");
	} else {
		app.useWebSocketAdapter(new IoAdapter(app));
		console.log("Socket.io: in-memory adapter (no REDIS_URL)");
	}

	app.useGlobalPipes(new ZodValidationPipe());
	app.enableCors({ origin: process.env.WEB_URL ?? "http://localhost:3000", credentials: true });

	const port = process.env.PORT ?? 3001;
	await app.listen(port, "0.0.0.0");
	console.log(`API running on port ${port}`);
}

bootstrap();
