import { MachineId } from "./machines";
import { GameState } from "./game";

export type SynergyId = string;

export interface SynergyConfig {
	id: SynergyId;
	name: string;
	machines: MachineId[];
	effect: (state: GameState) => number;
	condition: (state: GameState) => boolean;
	hidden: boolean;
}
