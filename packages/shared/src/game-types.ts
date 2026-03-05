import { z } from "zod";

export const ResourceTypeSchema = z.enum([
	"METAL",
	"CIRCUIT",
	"ENERGY",
	"HEAT",
	"GEAR",
	"CHIP",
	"PLASMA",
	"NANOFIBER",
	"QUANTUM_CORE",
	"DARK_MATTER",
]);

export type ResourceType = z.infer<typeof ResourceTypeSchema>;
