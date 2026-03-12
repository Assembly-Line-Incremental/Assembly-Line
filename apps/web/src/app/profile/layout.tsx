import { GameSaveProvider } from "@/features/game/context/game-save-context";
import { GameSocketProvider } from "@/features/game/context/game-socket-provider";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
	return (
		<GameSocketProvider>
			<GameSaveProvider>{children}</GameSaveProvider>
		</GameSocketProvider>
	);
}
