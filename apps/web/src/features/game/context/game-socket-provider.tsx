"use client";

import { useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import type { ClientToServerEvents, ServerToClientEvents } from "@assembly-line/shared";

type GameSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

/**
 * Manages the socket.io connection to the NestJS API.
 *
 * - Authenticates via a short-lived token from /api/auth/socket-token
 * - Presence (ONLINE / OFFLINE) is handled server-side via connect / disconnect lifecycle
 * - Listens for `save:changed` and invalidates the game.saves query
 *
 * Mount once in the game layout, outside GameSaveProvider.
 */
export function GameSocketProvider({ children }: { children: React.ReactNode }) {
	const queryClient = useQueryClient();
	const trpc = useTRPC();

	// Stable refs so the effect never re-fires
	const queryClientRef = useRef(queryClient);
	const trpcRef = useRef(trpc);
	useEffect(() => {
		queryClientRef.current = queryClient;
	}, [queryClient]);
	useEffect(() => {
		trpcRef.current = trpc;
	}, [trpc]);

	useEffect(() => {
		let socket: GameSocket | null = null;

		async function connect() {
			const res = await fetch("/api/auth/socket-token");
			if (!res.ok) return;
			const { token } = (await res.json()) as { token: string };

			const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
			socket = io(apiUrl, {
				auth: { token },
				transports: ["websocket"],
			});

			socket.on("connect", () => {
				queryClientRef.current.invalidateQueries({
					queryKey: trpcRef.current.user.getMe.queryKey(),
				});
			});

			socket.on("save:changed", () => {
				const queryKey = trpcRef.current.game.saves.queryOptions().queryKey;
				queryClientRef.current.invalidateQueries({ queryKey });
			});

			socket.on("game:state", (payload) => {
				const queryKey = trpcRef.current.game.resources.queryOptions({
					saveId: payload.saveId,
				}).queryKey;

				type ResourceRow = {
					type: string;
					amount: number;
					totalProduced: number;
					productionRate: number;
				};
				const existing = queryClientRef.current.getQueryData<ResourceRow[]>(queryKey) ?? [];
				const byType = new Map(existing.map((r) => [r.type, r]));

				queryClientRef.current.setQueryData<ResourceRow[]>(
					queryKey,
					payload.resources.map((r) => ({
						type: r.type,
						amount: r.amount,
						totalProduced: byType.get(r.type)?.totalProduced ?? 0,
						productionRate: r.ratePerSecond,
					}))
				);
			});
		}

		void connect();

		return () => {
			socket?.disconnect();
		};
	}, []); // stable via refs

	return <>{children}</>;
}
