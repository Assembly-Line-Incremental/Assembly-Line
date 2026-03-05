import { z } from "zod";
import { ResourceTypeSchema } from "./game-types";

// ── Server → Client events ────────────────────────────────────────────────────

export const ResourceSnapshotSchema = z.object({
	type: ResourceTypeSchema,
	amount: z.number(),
	ratePerSecond: z.number(),
});

export type ResourceSnapshot = z.infer<typeof ResourceSnapshotSchema>;

/** Full game state pushed after each tick */
export const GameStateSchema = z.object({
	saveId: z.string(),
	resources: z.array(ResourceSnapshotSchema),
	tickedAt: z.number(), // unix ms
});

export type GameState = z.infer<typeof GameStateSchema>;

/** Lightweight resource-only update */
export const ResourceUpdateSchema = z.object({
	saveId: z.string(),
	resources: z.array(ResourceSnapshotSchema),
});

export type ResourceUpdate = z.infer<typeof ResourceUpdateSchema>;

/** Emitted when a save is created, renamed, or deleted */
export const SaveChangedSchema = z.object({
	action: z.enum(["created", "renamed", "deleted"]),
	saveId: z.string(),
	name: z.string().optional(),
});

export type SaveChanged = z.infer<typeof SaveChangedSchema>;

// ── Event map (socket.io typing) ──────────────────────────────────────────────

export interface ServerToClientEvents {
	"game:state": (payload: GameState) => void;
	"game:resources": (payload: ResourceUpdate) => void;
	"save:changed": (payload: SaveChanged) => void;
}

// Actions go through REST (NestJS), not socket.io
export type ClientToServerEvents = Record<string, never>;
