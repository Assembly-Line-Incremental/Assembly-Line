import { requireAuth } from "@/lib/auth/auth-utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Play",
	description:
		"Launch your factory and start automating! Build machines, craft resources, and prestige to dominate the Assembly Line leaderboard.",
	openGraph: {
		type: "website",
		title: "Play Assembly Line – Your Factory Awaits",
		description:
			"Launch your factory and start automating! Build machines, craft resources, and prestige to dominate the Assembly Line leaderboard.",
		images: [
			{
				url: "/api/og/game",
				width: 1200,
				height: 630,
				alt: "Assembly Line – factory game screenshot",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Play Assembly Line – Your Factory Awaits",
		description:
			"Launch your factory and start automating! Build machines, craft resources, and prestige to dominate the Assembly Line leaderboard.",
		images: ["/api/og/game"],
	},
	robots: { index: false, follow: false },
};

const Play = async () => {
	await requireAuth();

	return <div>Play</div>;
};

export default Play;
