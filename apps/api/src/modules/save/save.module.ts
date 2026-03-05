import { Module } from "@nestjs/common";
import { SessionModule } from "../session/session.module";
import { GameModule } from "../game/game.module";
import { SocketModule } from "../socket/socket.module";
import { SaveService } from "./save.service";
import { SaveController } from "./save.controller";

@Module({
	imports: [SessionModule, GameModule, SocketModule],
	providers: [SaveService],
	controllers: [SaveController],
})
export class SaveModule {}
