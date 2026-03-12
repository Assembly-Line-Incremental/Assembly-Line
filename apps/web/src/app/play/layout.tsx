import type { Metadata } from "next";
import { GameSaveProvider } from "@/features/game/context/game-save-context";
import { GameSocketProvider } from "@/features/game/context/game-socket-provider";
import { ResourceHeader } from "@/features/game/components/resource-bar";

export const metadata: Metadata = {
	title: "Play · Assembly Line",
	openGraph: {
		title: "Your Factory Awaits · Assembly Line",
		images: [{ url: "/api/og/game", width: 1200, height: 630 }],
	},
	twitter: {
		card: "summary_large_image",
		images: ["/api/og/game"],
	},
};

export default function GameLayout({ children }: { children: React.ReactNode }) {
	return (
		<GameSocketProvider>
			<GameSaveProvider>
				<div className="min-h-screen bg-[#0A1A2F]">
					<ResourceHeader />
					{/* pt matches header height (h-17) */}
					<main className="pt-17">{children}</main>
				</div>
			</GameSaveProvider>
		</GameSocketProvider>
	);
}
