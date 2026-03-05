type Controller = ReadableStreamDefaultController<Uint8Array>;

const store = new Map<string, Set<Controller>>();

export function subscribe(userId: string, controller: Controller): void {
	let set = store.get(userId);
	if (!set) {
		set = new Set();
		store.set(userId, set);
	}
	set.add(controller);
}

export function unsubscribe(userId: string, controller: Controller): void {
	const set = store.get(userId);
	if (!set) return;
	set.delete(controller);
	if (set.size === 0) store.delete(userId);
}

/** Push a refresh event to all SSE clients on this process instance. */
export function notifyLocal(userId: string): void {
	const set = store.get(userId);
	if (!set) return;
	const payload = new TextEncoder().encode("data: refresh\n\n");
	for (const controller of set) {
		try {
			controller.enqueue(payload);
		} catch {
			// Controller already closed — will be cleaned up on disconnect
		}
	}
}
