import { AlertTriangle, CreditCard, KeyRound, Mail, User } from "lucide-react";
import { cn } from "@/lib/utils";

export type SettingsSection = "profil" | "compte" | "securite" | "supporter" | "danger";

const NAV_ITEMS: { label: string; id: SettingsSection; icon: React.ElementType }[] = [
	{ label: "Profil", id: "profil", icon: User },
	{ label: "Compte", id: "compte", icon: Mail },
	{ label: "Sécurité", id: "securite", icon: KeyRound },
	{ label: "Supporter", id: "supporter", icon: CreditCard },
	{ label: "Danger", id: "danger", icon: AlertTriangle },
];

export function SettingsNav({
	active,
	onSelect,
}: {
	active: SettingsSection;
	onSelect: (id: SettingsSection) => void;
}) {
	return (
		<>
			{/* ── Mobile: segmented control grid ── */}
			<nav
				className="grid grid-cols-5 gap-1 rounded-2xl border border-white/6 bg-white/2 p-1.5 md:hidden"
				aria-label="Paramètres"
			>
				{NAV_ITEMS.map((item) => {
					const isActive = active === item.id;
					return (
						<button
							key={item.id}
							type="button"
							aria-pressed={isActive}
							onClick={() => onSelect(item.id)}
							className={cn(
								"flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] transition-colors",
								isActive
									? item.id === "danger"
										? "bg-red-500/8 font-medium text-red-400"
										: "bg-white/6 font-medium text-white"
									: "text-white/35 hover:bg-white/4 hover:text-white/60"
							)}
						>
							<item.icon
								size={14}
								className={cn(
									isActive
										? item.id === "danger"
											? "text-red-400"
											: "text-[#00D4FF]"
										: "text-white/30"
								)}
							/>
							{item.label}
						</button>
					);
				})}
			</nav>

			{/* ── Desktop: sidebar ── */}
			<aside className="hidden w-44 shrink-0 md:block">
				<nav className="sticky top-[calc(4.25rem+2.5rem)]" aria-label="Paramètres">
					<p className="mb-1.5 px-3 text-[11px] font-semibold tracking-widest text-white/25 uppercase">
						Paramètres
					</p>
					<div className="flex flex-col gap-0.5">
						{NAV_ITEMS.map((item) => {
							const isActive = active === item.id;
							return (
								<button
									key={item.id}
									type="button"
									aria-pressed={isActive}
									onClick={() => onSelect(item.id)}
									className={cn(
										"flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] transition-colors",
										isActive
											? item.id === "danger"
												? "bg-red-500/8 font-medium text-red-400"
												: "bg-white/6 font-medium text-white"
											: "text-white/45 hover:bg-white/4 hover:text-white/70"
									)}
								>
									<item.icon
										size={14}
										className={cn(
											isActive
												? item.id === "danger"
													? "text-red-400"
													: "text-[#00D4FF]"
												: "text-white/30"
										)}
									/>
									{item.label}
								</button>
							);
						})}
					</div>
				</nav>
			</aside>
		</>
	);
}
