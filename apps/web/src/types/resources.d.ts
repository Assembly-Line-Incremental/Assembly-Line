import type { LucideIcon } from "lucide-react";

export type ResourceId =
	| "energy"
	| "matter"
	| "components"
	| "products"
	| "credits"
	| "alloys"
	| "data"
	| "research"
	| "waste";

export interface ResourcesState {
	energy: number;
	matter: number;
	components: number;
	products: number;
	credits: number;
	creditsCumulative: number;
	alloys: number;
	data: number;
	research: number;
	waste: number;
}

/** Single source of truth — aliased from the Prisma generated enum. */
export type { ResourceType } from "@assembly-line/db";

export interface ResourceConfig {
	/** Short display name */
	label: string;
	/** Lucide icon component */
	icon: LucideIcon;
	/** Hex accent colour used for the icon, glow, and highlights */
	color: string;
	/** Default maximum storage capacity (can be overridden by upgrades) */
	maxStorage: number;
	/**
	 * Era from which this resource appears in the hotbar.
	 * Mirrors the 6 eras defined in constants.ts.
	 */
	unlockEra: number;
	/** When true, a high fill % signals danger (e.g. HEAT) */
	highIsBad?: boolean;
}

export interface DisplayResource {
	type: ResourceType;
	amount: number;
	totalProduced: number;
	/** Net production rate in units/second, computed server-side from active machines */
	rate: number;
	config: ResourceConfig;
}
