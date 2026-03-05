import { Controller, Get, Module } from "@nestjs/common";
import { SessionModule } from "./modules/session/session.module";
import { SocketModule } from "./modules/socket/socket.module";
import { GameModule } from "./modules/game/game.module";
import { SaveModule } from "./modules/save/save.module";

@Controller()
class HealthController {
	@Get("health")
	health() {
		return { status: "ok" };
	}
}

@Module({
	imports: [SessionModule, SocketModule, GameModule, SaveModule],
	controllers: [HealthController],
})
export class AppModule {}
