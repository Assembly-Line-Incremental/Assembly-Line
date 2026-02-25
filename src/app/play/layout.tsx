import { GameSaveProvider } from "@/features/game/context/game-save-context";
import { ResourceHeader } from "@/features/game/components/resource-header";

export default function GameLayout({ children }: { children: React.ReactNode }) {
	return (
		<GameSaveProvider>
			<div className="min-h-screen bg-[#0A1A2F]">
				<ResourceHeader />
				{/* pt matches header height (h-17) */}
				<main className="pt-17">{children}</main>
			</div>
		</GameSaveProvider>
	);
}
