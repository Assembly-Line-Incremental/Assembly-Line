import { ResourcesState } from "./resources";
import { MachineId, MachineState } from "./machines";
import { SynergyConfig, SynergyId } from "./synergy";

export interface SaveInfo {
	id: string;
	slot: number;
	name: string;
	currentEra: number;
	prestigeCount: number;
	updatedAt: Date;
}

export interface GameSaveContextValue {
	/** ID of the currently selected game save, null while loading. */
	saveId: string | null;
	/** Era of the active save, used to filter unlocked resources. */
	currentEra: number;
	saves: SaveInfo[];
	maxSaves: number;
	isLoading: boolean;
	switchSave: (saveId: string) => void;
}

export type TechId = string;
export type RDNodeId = string;

export interface GameState {
	resources: ResourcesState;
	machines: Record<MachineId, MachineState>;
	synergyConfigs: Record<string, SynergyConfig>;

	milestones: Set<number>;
	technologies: Set<TechId>;
	synergies: {
		active: SynergyId[];
		discovered: Set<SynergyId>;
	};
	patents: number;
	rdTree: Set<RDNodeId>;

	era: number;
	prestigeCount: number;
	playTime: number;
	lastTick: number;

	tick: (delta: number) => void;
	upgradeMachine: (id: MachineId) => void;
	prestige: () => void;
}
