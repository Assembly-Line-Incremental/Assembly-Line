import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { subscribe, unsubscribe } from "@/lib/sse-store";
import { ensureListening } from "@/lib/pg-notify";

export const dynamic = "force-dynamic";

export async function GET() {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) {
		return new Response("Unauthorized", { status: 401 });
	}

	// Ensure this process is subscribed to pg NOTIFY before opening the stream.
	await ensureListening();

	const userId = session.user.id;
	let controller: ReadableStreamDefaultController<Uint8Array>;

	const stream = new ReadableStream<Uint8Array>({
		start(c) {
			controller = c;
			subscribe(userId, controller);
			controller.enqueue(new TextEncoder().encode("data: connected\n\n"));
		},
		cancel() {
			unsubscribe(userId, controller);
		},
	});

	return new Response(stream, {
		headers: {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache",
			Connection: "keep-alive",
		},
	});
}
