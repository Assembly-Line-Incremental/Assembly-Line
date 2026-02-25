"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function useSavesStream() {
	const queryClient = useQueryClient();
	const trpc = useTRPC();
	const queryKey = trpc.game.saves.queryOptions().queryKey;

	useEffect(() => {
		const es = new EventSource("/api/game/saves/stream");

		es.onmessage = (e) => {
			if (e.data === "refresh") {
				queryClient.invalidateQueries({ queryKey });
			}
		};

		return () => es.close();
	}, [queryClient, queryKey]);
}
