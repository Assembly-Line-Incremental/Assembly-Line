"use client";

import { usePresence } from "../hooks/use-presence";

/** Mounts the presence tracking hook. Renders nothing. */
export function PresenceManager() {
	usePresence();
	return null;
}
