"use client";

import Link from "next/link";
import { CreditCard, Loader2, Receipt, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { cn } from "@/lib/utils";
import { Section } from "@/features/profile/components/section";
import { HeroCard } from "./hero-card";

export function SectionSupporter() {
	const trpc = useTRPC();
	const { data: profile, isLoading } = useQuery(trpc.user.getMe.queryOptions());

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<Loader2 size={20} className="animate-spin text-white/25" />
			</div>
		);
	}

	if (!profile) {
		return (
			<div className="flex items-center justify-center py-12">
				<p className="text-[13px] text-white/25">Impossible de charger le profil.</p>
			</div>
		);
	}

	return (
		<>
			<HeroCard />

			<Section icon={CreditCard} title="Abonnement">
				{profile?.supporter?.isActive ? (
					<div className="flex items-center justify-between gap-4">
						<div className="flex items-center gap-3">
							<div
								className={cn(
									"flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
									profile.supporter.tier === "GOLD"
										? "bg-amber-500/10"
										: profile.supporter.tier === "SILVER"
											? "bg-slate-400/10"
											: "bg-orange-700/10"
								)}
							>
								<Zap
									size={15}
									className={cn(
										profile.supporter.tier === "GOLD"
											? "text-amber-400"
											: profile.supporter.tier === "SILVER"
												? "text-slate-300"
												: "text-orange-400"
									)}
								/>
							</div>
							<div>
								<p className="text-[13px] font-semibold text-white">
									Supporter {profile.supporter.tier}
								</p>
								<p className="mt-0.5 text-[11px] text-white/30">Abonnement actif</p>
							</div>
						</div>
						<Link
							href="https://polar.sh"
							target="_blank"
							rel="noopener noreferrer"
							className="text-[12px] text-[#00D4FF]/60 transition-colors hover:text-[#00D4FF]"
						>
							Gérer →
						</Link>
					</div>
				) : (
					<div className="flex items-center justify-between gap-4">
						<div>
							<p className="text-[13px] text-white/50">Aucun abonnement actif</p>
							<p className="mt-0.5 text-[11px] text-white/25">
								Soutenez le projet et débloquez des avantages exclusifs.
							</p>
						</div>
						<Link
							href="https://polar.sh"
							target="_blank"
							rel="noopener noreferrer"
							className="flex shrink-0 items-center gap-2 rounded-xl bg-[#FF7733]/10 px-4 py-2 text-[13px] font-medium text-[#FF7733] ring-1 ring-[#FF7733]/20 transition-colors hover:bg-[#FF7733]/15"
						>
							<Zap size={13} />
							Devenir Supporter
						</Link>
					</div>
				)}
			</Section>

			<Section icon={Receipt} title="Factures">
				<div className="py-4 text-center">
					<p className="text-[13px] text-white/25">Vos factures apparaîtront ici.</p>
				</div>
			</Section>
		</>
	);
}
