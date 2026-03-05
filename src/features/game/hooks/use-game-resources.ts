"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { RESOURCE_CONFIG } from "../config/resources";
import { useGameSave } from "../context/game-save-context";
import type { DisplayResource, ResourceType } from "@/types";

export function useGameResources() {
	const trpc = useTRPC();
	const { saveId, currentEra, isLoading: isLoadingSaves } = useGameSave();

	const { data: resources, isLoading } = useQuery({
		...trpc.game.resources.queryOptions({ saveId: saveId! }),
		enabled: !!saveId,
		// TODO: invalidate this query after any mutation that changes playerMachine state
		// (e.g. activateMachine/deactivateMachine) so production changes are reflected immediately.
		refetchInterval: 30_000,
		refetchIntervalInBackground: false,
	});

	const displayResources = useMemo<DisplayResource[]>(() => {
		if (!resources) return [];
		return resources
			.filter((r) => {
				const cfg = RESOURCE_CONFIG[r.type as ResourceType];
				return cfg && cfg.unlockEra <= currentEra;
			})
			.map((r) => ({
				type: r.type as ResourceType,
				amount: r.amount,
				totalProduced: r.totalProduced,
				rate: r.productionRate,
				config: RESOURCE_CONFIG[r.type as ResourceType],
			}));
	}, [resources, currentEra]);

	return { resources: displayResources, isLoading: isLoading || isLoadingSaves };
}
