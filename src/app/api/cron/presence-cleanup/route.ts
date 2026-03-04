import { NextResponse } from "next/server";
import { env } from "@/env";
import { markStalePresenceOffline } from "@/lib/presence";

/**
 * Cron endpoint: marks users as OFFLINE when their lastSeenAt is stale
 * (older than 2 × HEARTBEAT_INTERVAL = 60 s).
 *
 * Schedule this at an interval equal to or shorter than HEARTBEAT_INTERVAL
 * (e.g. every 30 s on Vercel Cron or an external scheduler).
 */
export async function GET(req: Request) {
	const authHeader = req.headers.get("authorization");
	if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
		return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
	}

	try {
		const result = await markStalePresenceOffline();
		return NextResponse.json({ ok: true, ...result });
	} catch (error) {
		console.error("[presence-cleanup] failed:", error);
		return NextResponse.json(
			{ ok: false, error: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 }
		);
	}
}
