import {
	Layers,
	Cpu,
	Zap,
	Flame,
	Cog,
	CircuitBoard,
	Sparkles,
	Network,
	Atom,
	Orbit,
} from "lucide-react";
import type { ResourceType, ResourceConfig } from "@/types";

export const ERA = {
	FOUNDATION: 1,
	INDUSTRIALIZATION: 2,
	AUTOMATION: 3,
	DIGITALIZATION: 4,
	SINGULARITY: 5,
	BEYOND: 6,
} as const;

export const RESOURCE_CONFIG: Record<ResourceType, ResourceConfig> = {
	// ── Era 1 · Foundation ────────────────────────────────────────────────────
	METAL: {
		label: "Metal",
		icon: Layers,
		color: "#94A3B8",
		maxStorage: 10_000,
		unlockEra: ERA.FOUNDATION,
	},
	ENERGY: {
		label: "Energy",
		icon: Zap,
		color: "#FFBB44",
		maxStorage: 2_000,
		unlockEra: ERA.FOUNDATION,
	},
	HEAT: {
		label: "Heat",
		icon: Flame,
		color: "#FF4422",
		maxStorage: 100,
		unlockEra: ERA.FOUNDATION,
		highIsBad: true,
	},
	// ── Era 2 · Industrialization ─────────────────────────────────────────────
	CIRCUIT: {
		label: "Circuit",
		icon: CircuitBoard,
		color: "#00D4FF",
		maxStorage: 5_000,
		unlockEra: ERA.INDUSTRIALIZATION,
	},
	GEAR: {
		label: "Gear",
		icon: Cog,
		color: "#8BA3B9",
		maxStorage: 5_000,
		unlockEra: ERA.INDUSTRIALIZATION,
	},
	// ── Era 3 · Automation ────────────────────────────────────────────────────
	CHIP: {
		label: "Chip",
		icon: Cpu,
		color: "#0DD8B5",
		maxStorage: 3_000,
		unlockEra: ERA.AUTOMATION,
	},
	PLASMA: {
		label: "Plasma",
		icon: Sparkles,
		color: "#A855F7",
		maxStorage: 2_000,
		unlockEra: ERA.AUTOMATION,
	},
	// ── Era 4 · Digitalization ────────────────────────────────────────────────
	NANOFIBER: {
		label: "Nanofiber",
		icon: Network,
		color: "#22C55E",
		maxStorage: 1_000,
		unlockEra: ERA.DIGITALIZATION,
	},
	// ── Era 5 · Singularity ───────────────────────────────────────────────────
	QUANTUM_CORE: {
		label: "Q.Core",
		icon: Atom,
		color: "#818CF8",
		maxStorage: 500,
		unlockEra: ERA.SINGULARITY,
	},
	// ── Era 6 · Beyond ───────────────────────────────────────────────────────
	DARK_MATTER: {
		label: "Dark Matter",
		icon: Orbit,
		color: "#C026D3",
		maxStorage: 100,
		unlockEra: ERA.BEYOND,
	},
};
