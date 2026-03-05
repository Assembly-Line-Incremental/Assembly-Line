import { ResourceId } from "./resources";

export type MachineId =
	| "generator"
	| "extractor"
	| "assembler"
	| "assemblyLine"
	| "terminal"
	| "foundry"
	| "computeCenter"
	| "cryo"
	| "lab"
	| "recycler";

export interface MachineState {
	level: number;
	production: number;
	enabled: boolean;
}

export interface MachineConfig {
	id: MachineId;
	name: string;
	description: string;
	baseCost: number;
	baseProduction: number;
	energyConsumption: number;
	heatGeneration: number;
	input?: { resource: ResourceId; amount: number };
	output: { resource: ResourceId; amount: number };
	unlockMilestone: number;
}
