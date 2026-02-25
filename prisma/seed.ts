import { Prisma } from "@/generated/prisma/client";
import "./load-env";
import { prisma } from "@/lib/db";

const ERA_1_MACHINES: Prisma.MachineDefinitionCreateInput[] = [
	// ── TIER 0 : Basics Generators ───────────────────────────────────────
	{
		slug: "generator",
		name: "Generator",
		era: 1,
		baseCost: { ENERGY: 10 },
		costMultiplier: 1.08,
		baseProduction: { ENERGY: 1 },
		baseConsumption: {},
		baseHeat: 1,
		maxLevel: 50,
	},
	{
		slug: "extractor",
		name: "Extractor",
		era: 1,
		baseCost: { METAL: 10 },
		costMultiplier: 1.08,
		baseProduction: { METAL: 1 },
		baseConsumption: {},
		baseHeat: 1,
		maxLevel: 50,
	},

	// ── TIER 1 : Simple Transformation ───────────────────────────────────────
	{
		slug: "assembler",
		name: "Assembler",
		era: 1,
		baseCost: { METAL: 50, ENERGY: 25 },
		costMultiplier: 1.1,
		baseProduction: { GEAR: 0.5 },
		baseConsumption: { METAL: 2 },
		baseHeat: 2,
		unlockCondition: { resource: "METAL", amount: 50 },
		maxLevel: 40,
	},
	{
		slug: "foundry",
		name: "Foundry",
		era: 1,
		baseCost: { METAL: 75, ENERGY: 50 },
		costMultiplier: 1.1,
		baseProduction: { CIRCUIT: 0.3 },
		baseConsumption: { METAL: 3, ENERGY: 2 },
		baseHeat: 4,
		unlockCondition: { resource: "METAL", amount: 100 },
		maxLevel: 40,
	},
	{
		slug: "recycler",
		name: "Recycler",
		era: 1,
		baseCost: { METAL: 80, GEAR: 10 },
		costMultiplier: 1.09,
		baseProduction: { METAL: 2, ENERGY: 1 },
		baseConsumption: { GEAR: 0.5 },
		baseHeat: 2,
		unlockCondition: { resource: "GEAR", amount: 10 },
		maxLevel: 35,
	},

	// ── TIER 2 : Advanced Productions ───────────────────────────────────────
	{
		slug: "line",
		name: "Production Line",
		era: 1,
		baseCost: { METAL: 200, GEAR: 20 },
		costMultiplier: 1.12,
		baseProduction: { GEAR: 1.5, CIRCUIT: 0.5 },
		baseConsumption: { METAL: 8, ENERGY: 5 },
		baseHeat: 6,
		unlockCondition: { resource: "GEAR", amount: 25 },
		maxLevel: 35,
	},
	{
		slug: "terminal",
		name: "Terminal",
		era: 1,
		baseCost: { METAL: 150, CIRCUIT: 10 },
		costMultiplier: 1.11,
		baseProduction: { CHIP: 0.1 },
		baseConsumption: { ENERGY: 5, CIRCUIT: 1 },
		baseHeat: 3,
		unlockCondition: { resource: "CIRCUIT", amount: 15 },
		maxLevel: 30,
	},
	{
		slug: "compute-center",
		name: "Compute Center",
		era: 1,
		baseCost: { METAL: 500, CIRCUIT: 30, GEAR: 15 },
		costMultiplier: 1.14,
		baseProduction: { CHIP: 0.4 },
		baseConsumption: { ENERGY: 10, CIRCUIT: 2 },
		baseHeat: 8,
		unlockCondition: { resource: "CHIP", amount: 5 },
		maxLevel: 25,
	},

	// ── Utils ───────────────────────────────────────────────────────────────
	{
		slug: "cryo",
		name: "Cryo Module",
		era: 1,
		baseCost: { METAL: 120, CIRCUIT: 15 },
		costMultiplier: 1.1,
		baseProduction: {},
		baseConsumption: { ENERGY: 8 },
		baseHeat: -10,
		unlockCondition: { milestone: "first-overheat" },
		maxLevel: 30,
	},
	{
		slug: "lab",
		name: "Laboratory",
		era: 1,
		baseCost: { METAL: 300, CIRCUIT: 20, CHIP: 3 },
		costMultiplier: 1.13,
		baseProduction: { CHIP: 0.2 },
		baseConsumption: { ENERGY: 6, CHIP: 0.5 },
		baseHeat: 3,
		unlockCondition: { resource: "CHIP", amount: 3 },
		maxLevel: 25,
	},
	{
		slug: "conveyor",
		name: "Conveyor Belt",
		era: 1,
		baseCost: { METAL: 60, GEAR: 5 },
		costMultiplier: 1.09,
		baseProduction: {},
		baseConsumption: { ENERGY: 3 },
		baseHeat: 1,
		unlockCondition: { machine: "assembler", level: 3 },
		maxLevel: 20,
	},
	{
		slug: "storage",
		name: "Storage Unit",
		era: 1,
		baseCost: { METAL: 40, GEAR: 3 },
		costMultiplier: 1.07,
		baseProduction: {},
		baseConsumption: {},
		baseHeat: 0,
		unlockCondition: { resource: "METAL", amount: 200 },
		maxLevel: 30,
	},
];

async function main() {
	console.log("🌱 Seeding database...");

	await Promise.all(
		ERA_1_MACHINES.map((machine) =>
			prisma.machineDefinition
				.upsert({
					where: { slug: machine.slug },
					update: machine,
					create: machine,
				})
				.then(() => console.log(`✅ Seeded machine: ${machine.name}`))
		)
	);
	console.log(`\n✅ ${ERA_1_MACHINES.length} seeded machines.`);

	console.log("\n✅ Seed completed.");
}

main()
	.catch((e) => {
		console.error("❌ Seed failed:", e);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());
