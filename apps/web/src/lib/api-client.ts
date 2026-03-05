/**
 * Typed REST client for the NestJS API (apps/api).
 * Sends credentials (cookie) automatically — no token management needed.
 * Throws ApiError on non-2xx responses.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export class ApiError extends Error {
	constructor(
		public readonly status: number,
		message: string
	) {
		super(message);
		this.name = "ApiError";
	}
}

async function apiFetch<T = void>(path: string, init?: RequestInit): Promise<T> {
	const res = await fetch(`${API_URL}${path}`, {
		...init,
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			...init?.headers,
		},
	});

	if (!res.ok) {
		const body = await res.text().catch(() => res.statusText);
		throw new ApiError(res.status, body);
	}

	// 204 No Content
	if (res.status === 204) return undefined as T;
	return res.json() as Promise<T>;
}

// ── Machine actions ────────────────────────────────────────────────────────────

export const apiClient = {
	machines: {
		/**
		 * Buy `count` machines. Returns the updated PlayerMachine record.
		 */
		buy(saveId: string, machineId: string, count: number) {
			return apiFetch<{ count: number; isActive: boolean }>(`/save/${saveId}/machine/buy`, {
				method: "POST",
				body: JSON.stringify({ machineId, count }),
			});
		},

		/**
		 * Toggle a machine's active state.
		 */
		setActive(saveId: string, machineId: string, isActive: boolean) {
			return apiFetch<void>(`/save/${saveId}/machine/${machineId}/active`, {
				method: "PATCH",
				body: JSON.stringify({ isActive }),
			});
		},
	},

	save: {
		/**
		 * Prestige the save. Returns the number of prestige points awarded.
		 */
		prestige(saveId: string) {
			return apiFetch<{ prestigePoints: number }>(`/save/${saveId}/prestige`, {
				method: "POST",
			});
		},
	},
};
