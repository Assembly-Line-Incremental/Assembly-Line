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
