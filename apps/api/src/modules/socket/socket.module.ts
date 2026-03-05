import { Module } from "@nestjs/common";
import { SessionModule } from "../session/session.module";
import { SocketController } from "./socket.controller";
import { SocketGateway } from "./socket.gateway";

@Module({
	imports: [SessionModule],
	providers: [SocketGateway],
	controllers: [SocketController],
	exports: [SocketGateway],
})
export class SocketModule {}
