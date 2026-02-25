"use client";

import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { HEARTBEAT_INTERVAL_MS, IDLE_TIMEOUT_MS } from "@/lib/constants/presence";

const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"] as const;

/**
 * Tracks player presence and syncs it to the server.
 *
 * - Sends a heartbeat every 30 s while active → ONLINE
 * - Transitions to IDLE after 10 min of inactivity
 * - Sets OFFLINE on page hide / unload
 *
 * Mount once in the game layout.
 */
export function usePresence() {
	const trpc = useTRPC();

	const { mutate: heartbeat } = useMutation(trpc.game.heartbeat.mutationOptions());
	const { mutate: setIdle } = useMutation(trpc.game.setIdle.mutationOptions());
	const { mutate: setOffline } = useMutation(trpc.game.setOffline.mutationOptions());

	const isIdleRef = useRef(false);
	const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const heartbeatTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

	useEffect(() => {
		// ── Idle timer ──────────────────────────────────────────────────────
		function resetIdleTimer() {
			if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

			if (isIdleRef.current) {
				// Came back from idle → go online again
				isIdleRef.current = false;
				heartbeat();
			}

			idleTimerRef.current = setTimeout(() => {
				isIdleRef.current = true;
				setIdle();
			}, IDLE_TIMEOUT_MS);
		}

		// ── Heartbeat interval ──────────────────────────────────────────────
		heartbeat(); // immediate on mount
		heartbeatTimerRef.current = setInterval(() => {
			if (!isIdleRef.current) heartbeat();
		}, HEARTBEAT_INTERVAL_MS);

		// ── Activity listeners ──────────────────────────────────────────────
		ACTIVITY_EVENTS.forEach((e) => {
			window.addEventListener(e, resetIdleTimer, { passive: true });
		});
		resetIdleTimer();

		// ── Offline on page hide / unload ───────────────────────────────────
		function handleHide() {
			if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
			idleTimerRef.current = null;
			isIdleRef.current = true;
			setOffline();
		}

		function handleVisibilityChange() {
			if (document.visibilityState === "hidden") handleHide();
			else {
				// Page became visible → reset presence
				isIdleRef.current = false;
				heartbeat();
				resetIdleTimer();
			}
		}

		document.addEventListener("visibilitychange", handleVisibilityChange);
		window.addEventListener("beforeunload", handleHide);

		return () => {
			if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
			if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);
			ACTIVITY_EVENTS.forEach((e) => {
				window.removeEventListener(e, resetIdleTimer);
			});
			document.removeEventListener("visibilitychange", handleVisibilityChange);
			window.removeEventListener("beforeunload", handleHide);
			setOffline();
		};
	}, [heartbeat, setIdle, setOffline]);
}
