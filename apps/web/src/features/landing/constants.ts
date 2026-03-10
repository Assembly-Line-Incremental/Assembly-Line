import {
	Zap,
	Factory,
	TrendingUp,
	Layers,
	FlaskConical,
	RotateCcw,
	Flame,
	Cpu,
	Sparkles,
	Pickaxe,
	Bot,
	Binary,
	Orbit,
	Infinity,
} from "lucide-react";

export const FEATURES = [
	{
		icon: Factory,
		title: "10 Unique Machines",
		description:
			"From simple generators to advanced compute centers. Each machine transforms resources in unique ways.",
		color: "#00D4FF",
	},
	{
		icon: Zap,
		title: "9 Resource Types",
		description:
			"Energy, matter, components, credits, alloys, data, and more. Master the flow to maximize output.",
		color: "#FFBB44",
	},
	{
		icon: TrendingUp,
		title: "Deep Progression",
		description:
			"Unlock milestones, push through eras, and discover hidden synergies as your factory evolves.",
		color: "#00D4FF",
	},
	{
		icon: Layers,
		title: "Synergy System",
		description:
			"Combine the right machines to trigger powerful synergy bonuses. Some are hidden — can you find them all?",
		color: "#FF7733",
	},
	{
		icon: FlaskConical,
		title: "Technology Tree",
		description:
			"Research new technologies to unlock advanced production chains and optimize your assembly line.",
		color: "#00D4FF",
	},
	{
		icon: RotateCcw,
		title: "Prestige & R&D",
		description:
			"Reset for Patents, invest in R&D, and come back stronger. Each prestige multiplies your potential.",
		color: "#FFBB44",
	},
] as const;

export const ERAS = [
	{
		name: "Foundation",
		era: 1,
		description: "Basic machines and resources",
		color: "#00D4FF",
		icon: Pickaxe,
	},
	{
		name: "Industrialization",
		era: 2,
		description: "Advanced production chains",
		color: "#0099DD",
		icon: Factory,
	},
	{
		name: "Automation",
		era: 3,
		description: "Smart factories and synergies",
		color: "#FFBB44",
		icon: Bot,
	},
	{
		name: "Digitalization",
		era: 4,
		description: "Data-driven optimization",
		color: "#FF7733",
		icon: Binary,
	},
	{
		name: "Singularity",
		era: 5,
		description: "Transcend the assembly line",
		color: "#FF4422",
		icon: Orbit,
	},
	{
		name: "Beyond",
		era: 6,
		description: "What lies past the singularity?",
		color: "#EE4422",
		icon: Infinity,
	},
] as const;

export const PIPELINE_STEPS = [
	{
		step: "01",
		title: "Generate Energy",
		desc: "Start with basic generators. Energy powers everything in your assembly line.",
		icon: Zap,
		color: "#FFBB44",
	},
	{
		step: "02",
		title: "Extract & Assemble",
		desc: "Extract raw matter, refine it into components, and assemble products for credits.",
		icon: Factory,
		color: "#00D4FF",
	},
	{
		step: "03",
		title: "Manage Heat & Waste",
		desc: "Machines overheat. Waste accumulates. Balance your line or watch it break down.",
		icon: Flame,
		color: "#FF4422",
	},
	{
		step: "04",
		title: "Discover Synergies",
		desc: "The right combination of machines unlocks hidden multipliers and bonus effects.",
		icon: Sparkles,
		color: "#FF7733",
	},
	{
		step: "05",
		title: "Prestige & Evolve",
		desc: "Reset your factory, earn Patents, and unlock the R&D tree. Each cycle makes you exponentially stronger.",
		icon: RotateCcw,
		color: "#00D4FF",
	},
] as const;

export const STATS = [
	{ label: "Machines", value: "10", icon: Cpu },
	{ label: "Resources", value: "9", icon: Sparkles },
	{ label: "Eras", value: "6", icon: Layers },
	{ label: "Technologies", value: "50+", icon: FlaskConical },
] as const;
