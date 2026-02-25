"use client";

import { useEffect, useMemo, useReducer } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { RESOURCE_CONFIG } from "../config/resources";
import { useGameSave } from "../context/game-save-context";
import type { DisplayResource, ResourceType } from "@/types";

type AmountMap = Partial<Record<string, number>>;

type RatesState = {
	rates: AmountMap;
	prevAmounts: AmountMap | null;
	prevTimestamp: number | null;
};

type RatesAction =
	| { type: "update"; resources: Array<{ type: string; amount: number }> }
	| { type: "reset" };

function ratesReducer(state: RatesState, action: RatesAction): RatesState {
	if (action.type === "reset") {
		return { rates: {}, prevAmounts: null, prevTimestamp: null };
	}
	const { resources } = action;
	if (!resources.length) return state;

	const now = Date.now();
	let newRates = state.rates;

	if (state.prevAmounts !== null && state.prevTimestamp !== null) {
		const elapsed = (now - state.prevTimestamp) / 1_000;
		if (elapsed > 0) {
			newRates = {};
			for (const r of resources) {
				const prev = state.prevAmounts[r.type] ?? 0;
				newRates[r.type] = (r.amount - prev) / elapsed;
			}
		}
	}

	return {
		rates: newRates,
		prevAmounts: Object.fromEntries(resources.map((r) => [r.type, r.amount])),
		prevTimestamp: now,
	};
}

export function useGameResources() {
	const trpc = useTRPC();
	const { saveId, currentEra, isLoading: isLoadingSaves } = useGameSave();

	const [{ rates }, dispatchRates] = useReducer(ratesReducer, {
		rates: {},
		prevAmounts: null,
		prevTimestamp: null,
	});

	const { data: resources, isLoading } = useQuery({
		...trpc.game.resources.queryOptions({ saveId: saveId! }),
		enabled: !!saveId,
		refetchInterval: 1_000,
		refetchIntervalInBackground: false,
	});

	// Compute production rates from successive snapshots
	useEffect(() => {
		if (!resources?.length) return;
		dispatchRates({ type: "update", resources });
	}, [resources]);

	// Reset rates when switching save
	useEffect(() => {
		dispatchRates({ type: "reset" });
	}, [saveId]);

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
				rate: rates[r.type] ?? 0,
				config: RESOURCE_CONFIG[r.type as ResourceType],
			}));
	}, [resources, rates, currentEra]);

	return { resources: displayResources, isLoading: isLoading || isLoadingSaves };
}
