import { Module } from "@nestjs/common";
import { SessionService } from "./session.service";
import { SessionGuard } from "./session.guard";

@Module({
	providers: [SessionService, SessionGuard],
	exports: [SessionService, SessionGuard],
})
export class SessionModule {}
