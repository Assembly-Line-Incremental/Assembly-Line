import { prisma } from "@/lib/db";
import { PresenceStatus } from "@/generated/prisma/client";
import { STALE_THRESHOLD_MS } from "@/lib/constants/presence";

export async function markStalePresenceOffline(): Promise<{ markedOffline: number }> {
	const cutoff = new Date(Date.now() - STALE_THRESHOLD_MS);

	const { count } = await prisma.user.updateMany({
		where: {
			presenceStatus: { not: PresenceStatus.OFFLINE },
			lastSeenAt: { lt: cutoff },
		},
		data: { presenceStatus: PresenceStatus.OFFLINE },
	});

	return { markedOffline: count };
}
