import { Module } from "@nestjs/common";
import { SocketModule } from "../socket/socket.module";
import { GameService } from "./game.service";

@Module({
	imports: [SocketModule],
	providers: [GameService],
	exports: [GameService],
})
export class GameModule {}
