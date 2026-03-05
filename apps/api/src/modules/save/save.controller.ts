import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
	Req,
	UseGuards,
} from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { SessionGuard } from "../session/session.guard";
import type { AuthUser } from "../session/session.service";
import { SaveService } from "./save.service";

// ── DTOs ──────────────────────────────────────────────────────────────────────

class SetActiveSaveDto extends createZodDto(z.object({ saveId: z.string() })) {}

class RenameSaveDto extends createZodDto(z.object({ name: z.string().trim().min(1).max(32) })) {}

class BuyMachineDto extends createZodDto(
	z.object({
		machineId: z.string(),
		count: z.number().int().min(1).max(100),
	})
) {}

class SetActiveDto extends createZodDto(z.object({ isActive: z.boolean() })) {}

// ── Controller ────────────────────────────────────────────────────────────────

type AuthRequest = FastifyRequest & { user: AuthUser };

@Controller("save")
@UseGuards(SessionGuard)
export class SaveController {
	constructor(private readonly saveService: SaveService) {}

	// ── Save CRUD ───────────────────────────────────────────────────────────

	/** GET /save */
	@Get()
	getSaves(@Req() req: AuthRequest) {
		return this.saveService.getSaves(req.user.id);
	}

	/** POST /save */
	@Post()
	createSave(@Req() req: AuthRequest) {
		return this.saveService.createSave(req.user.id);
	}

	/** POST /save/set-active — must be declared before :saveId routes */
	@Post("set-active")
	@HttpCode(204)
	setActiveSave(@Body() dto: SetActiveSaveDto, @Req() req: AuthRequest) {
		return this.saveService.setActiveSave(req.user.id, dto.saveId);
	}

	/** PATCH /save/:saveId/name */
	@Patch(":saveId/name")
	@HttpCode(204)
	renameSave(
		@Param("saveId") saveId: string,
		@Body() dto: RenameSaveDto,
		@Req() req: AuthRequest
	) {
		return this.saveService.renameSave(req.user.id, saveId, dto.name);
	}

	/** DELETE /save/:saveId */
	@Delete(":saveId")
	@HttpCode(204)
	deleteSave(@Param("saveId") saveId: string, @Req() req: AuthRequest) {
		return this.saveService.deleteSave(req.user.id, saveId);
	}

	// ── Resources & Machines ────────────────────────────────────────────────

	/** GET /save/:saveId/resources */
	@Get(":saveId/resources")
	getResources(@Param("saveId") saveId: string, @Req() req: AuthRequest) {
		return this.saveService.getResources(req.user.id, saveId);
	}

	/** GET /save/:saveId/machines */
	@Get(":saveId/machines")
	getMachines(@Param("saveId") saveId: string, @Req() req: AuthRequest) {
		return this.saveService.getMachines(req.user.id, saveId);
	}

	// ── Machine actions ─────────────────────────────────────────────────────

	/** POST /save/:saveId/machine/buy */
	@Post(":saveId/machine/buy")
	buy(@Param("saveId") saveId: string, @Body() dto: BuyMachineDto, @Req() req: AuthRequest) {
		return this.saveService.buyMachine(req.user.id, saveId, dto.machineId, dto.count);
	}

	/** PATCH /save/:saveId/machine/:machineId/active */
	@Patch(":saveId/machine/:machineId/active")
	@HttpCode(204)
	setActive(
		@Param("saveId") saveId: string,
		@Param("machineId") machineId: string,
		@Body() dto: SetActiveDto,
		@Req() req: AuthRequest
	) {
		return this.saveService.setMachineActive(req.user.id, saveId, machineId, dto.isActive);
	}

	/** POST /save/:saveId/prestige */
	@Post(":saveId/prestige")
	prestige(@Param("saveId") saveId: string, @Req() req: AuthRequest) {
		return this.saveService.prestige(req.user.id, saveId);
	}
}
