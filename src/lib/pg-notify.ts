import pg from "pg";
import { env } from "@/env";
import { notifyLocal } from "./sse-store";

const unpooledUrl = env.DATABASE_URL.replace("-pooler", "");

const CHANNEL = "saves_changed";

// One persistent connection per process instance for LISTEN.
let client: pg.Client | null = null;

async function getListenerClient(): Promise<pg.Client> {
	if (client) return client;
	client = new pg.Client({ connectionString: unpooledUrl });
	await client.connect();
	await client.query(`LISTEN ${CHANNEL}`);
	client.on("notification", (msg) => {
		if (msg.channel === CHANNEL && msg.payload) {
			notifyLocal(msg.payload);
		}
	});
	client.on("error", () => {
		// On error, reset so the next SSE connection re-establishes the listener.
		client = null;
	});
	return client;
}

/**
 * Subscribe the current process to LISTEN notifications.
 * Call once when the first SSE connection opens.
 */
export async function ensureListening(): Promise<void> {
	await getListenerClient();
}

/**
 * Send a NOTIFY to all processes via PostgreSQL.
 * Uses a short-lived connection from the pooler — NOTIFY works on pooled connections.
 */
export async function pgNotify(userId: string): Promise<void> {
	const notifier = new pg.Client({ connectionString: unpooledUrl });
	try {
		await notifier.connect();
		await notifier.query(`NOTIFY ${CHANNEL}, $1`, [userId]);
	} finally {
		await notifier.end().catch(() => {});
	}
}
