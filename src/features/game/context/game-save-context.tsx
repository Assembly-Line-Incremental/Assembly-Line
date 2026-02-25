"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import type { GameSaveContextValue } from "@/types";

const GameSaveContext = createContext<GameSaveContextValue | null>(null);

const LS_KEY = "assemblyline:activeSaveId";

export function GameSaveProvider({ children }: { children: ReactNode }) {
	const trpc = useTRPC();
	const [manualSaveId, setManualSaveId] = useState<string | null>(() =>
		typeof window !== "undefined" ? localStorage.getItem(LS_KEY) : null
	);

	const { data: saves = [], isLoading } = useQuery(trpc.game.saves.queryOptions());

	// Derive active save: prefer manualSaveId if valid, then slot 1, then first save.
	const saveId = useMemo(() => {
		if (!saves.length) return null;
		const match = manualSaveId ? saves.find((s) => s.id === manualSaveId) : null;
		return (match ?? saves.find((s) => s.slot === 1) ?? saves[0])?.id ?? null;
	}, [saves, manualSaveId]);

	const switchSave = useCallback((id: string) => {
		setManualSaveId(id);
		localStorage.setItem(LS_KEY, id);
	}, []);

	const currentEra = saves.find((s) => s.id === saveId)?.currentEra ?? 1;

	const value = useMemo<GameSaveContextValue>(
		() => ({ saveId, currentEra, saves, isLoading, switchSave }),
		[saveId, currentEra, saves, isLoading, switchSave]
	);

	return <GameSaveContext.Provider value={value}>{children}</GameSaveContext.Provider>;
}

export function useGameSave(): GameSaveContextValue {
	const ctx = useContext(GameSaveContext);
	if (!ctx) throw new Error("useGameSave must be used inside <GameSaveProvider>");
	return ctx;
}
