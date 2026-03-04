/**
 * Shared presence constants used by both client and server.
 *
 * HEARTBEAT_INTERVAL_MS  – how often the client sends a heartbeat (30 s).
 * STALE_THRESHOLD_MS     – after 2 × HEARTBEAT_INTERVAL without a heartbeat
 *                          the server considers the user OFFLINE (60 s).
 * IDLE_TIMEOUT_MS        – client-side inactivity timeout before marking
 *                          the user IDLE (10 min).
 */

export const HEARTBEAT_INTERVAL_MS = 30_000; // 30 s
export const STALE_THRESHOLD_MS = 2 * HEARTBEAT_INTERVAL_MS; // 60 s
export const IDLE_TIMEOUT_MS = 10 * 60 * 1000; // 10 min
