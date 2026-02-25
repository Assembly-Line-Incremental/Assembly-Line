"use client";

import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useSavesStream } from "../hooks/use-saves-stream";
import type { GameSaveContextValue } from "@/types";

const GameSaveContext = createContext<GameSaveContextValue | null>(null);

export function GameSaveProvider({ children }: { children: ReactNode }) {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	useSavesStream();

	const savesQueryKey = trpc.game.saves.queryOptions().queryKey;

	const { data, isLoading } = useQuery({
		...trpc.game.saves.queryOptions(),
		refetchInterval: 30_000,
		refetchIntervalInBackground: false,
	});

	const saves = data?.saves ?? [];
	const maxSaves = data?.maxSaves ?? 2;
	const activeSaveId = data?.activeSaveId ?? null;

	// Active save is stored server-side and synced across all devices.
	const saveId = useMemo(() => {
		if (!saves.length) return null;
		const serverActive = activeSaveId ? saves.find((s) => s.id === activeSaveId) : null;
		return (serverActive ?? saves.find((s) => s.slot === 1) ?? saves[0])?.id ?? null;
	}, [saves, activeSaveId]);

	const setActiveSave = useMutation(
		trpc.game.setActiveSave.mutationOptions({
			onSuccess: () => queryClient.invalidateQueries({ queryKey: savesQueryKey }),
		})
	);

	const switchSave = useCallback(
		(id: string) => {
			setActiveSave.mutate({ saveId: id });
		},
		[setActiveSave]
	);

	const currentEra = saves.find((s) => s.id === saveId)?.currentEra ?? 1;

	const value = useMemo<GameSaveContextValue>(
		() => ({ saveId, currentEra, saves, maxSaves, isLoading, switchSave }),
		[saveId, currentEra, saves, maxSaves, isLoading, switchSave]
	);

	return <GameSaveContext.Provider value={value}>{children}</GameSaveContext.Provider>;
}

export function useGameSave(): GameSaveContextValue {
	const ctx = useContext(GameSaveContext);
	if (!ctx) throw new Error("useGameSave must be used inside <GameSaveProvider>");
	return ctx;
}
