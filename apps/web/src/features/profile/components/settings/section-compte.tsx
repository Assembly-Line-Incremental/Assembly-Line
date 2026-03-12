"use client";

import { useState } from "react";
import { Link, Link2, Loader2, Mail, Pencil, Unlink } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import Image from "next/image";
import { authClient } from "@/lib/auth/auth-client";
import { ALL_PROVIDERS, oauthConfig } from "@/lib/auth/oauth-providers";
import type { OAuthProvider } from "@/lib/auth/oauth-providers";
import { Section } from "@/features/profile/components/section";
import { HeroCard } from "./hero-card";

export function SectionCompte() {
	const { data: session } = authClient.useSession();
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	const { data: profile } = useQuery(trpc.user.getMe.queryOptions());

	const { data: accounts } = useQuery({
		queryKey: ["linked-accounts"],
		queryFn: async () => {
			const res = await authClient.listAccounts();
			return res.data ?? [];
		},
		enabled: !!session,
	});

	const [pendingProvider, setPendingProvider] = useState<OAuthProvider | null>(null);

	const email = profile?.email ?? session?.user.email ?? "";

	async function handleLink(provider: OAuthProvider) {
		setPendingProvider(provider);
		try {
			await authClient.linkSocial({
				provider,
				callbackURL: window.location.origin + "/profile/settings",
			});
			// page is navigating away, don't reset state
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Impossible de connecter ce compte");
			setPendingProvider(null);
		}
	}

	async function handleUnlink(provider: OAuthProvider) {
		setPendingProvider(provider);
		try {
			const res = await authClient.unlinkAccount({ providerId: provider });
			if (res.error) {
				toast.error(res.error.message ?? "Impossible de déconnecter ce compte");
			} else {
				toast.success(`Compte ${oauthConfig[provider].label} déconnecté`);
				queryClient.invalidateQueries({ queryKey: ["linked-accounts"] });
			}
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Impossible de déconnecter ce compte");
		} finally {
			setPendingProvider(null);
		}
	}

	return (
		<>
			<HeroCard />

			<Section icon={Mail} title="Adresse email">
				<div className="flex items-center justify-between gap-4">
					<div>
						<p className="text-[13px] text-white">{email}</p>
						<p className="mt-0.5 text-[11px] text-white/30">
							{profile?.emailVerified ? "Adresse vérifiée" : "Adresse non vérifiée"}
						</p>
					</div>
					<span className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/3 px-4 py-2 text-[13px] text-white/20">
						<Pencil size={13} />
						Modifier
					</span>
				</div>
			</Section>

			<Section icon={Link2} title="Comptes connectés">
				<div className="space-y-2">
					{ALL_PROVIDERS.map((provider) => {
						const { label, logo } = oauthConfig[provider];
						const isLinked = accounts?.some((a) => a.providerId === provider);
						const isPending = pendingProvider === provider;
						return (
							<div
								key={provider}
								className="flex items-center justify-between rounded-xl border border-white/6 bg-white/3 px-4 py-3"
							>
								<div className="flex items-center gap-3">
									<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5">
										<Image
											src={logo}
											alt=""
											width={16}
											height={16}
											aria-hidden
										/>
									</div>
									<div>
										<span className="text-[13px] text-white/60">{label}</span>
										{isLinked && (
											<p className="mt-0.5 text-[11px] text-emerald-400/60">
												Connecté
											</p>
										)}
									</div>
								</div>
								{isLinked ? (
									<button
										type="button"
										onClick={() => handleUnlink(provider)}
										disabled={isPending}
										className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] text-red-400/60 transition-colors hover:bg-red-500/8 hover:text-red-400 disabled:opacity-40"
									>
										{isPending ? (
											<Loader2 size={11} className="animate-spin" />
										) : (
											<Unlink size={11} />
										)}
										Déconnecter
									</button>
								) : (
									<button
										type="button"
										onClick={() => handleLink(provider)}
										disabled={isPending}
										className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] text-white/30 transition-colors hover:bg-white/6 hover:text-white/50 disabled:opacity-40"
									>
										{isPending ? (
											<Loader2 size={11} className="animate-spin" />
										) : (
											<Link size={11} />
										)}
										Connecter
									</button>
								)}
							</div>
						);
					})}
				</div>
			</Section>
		</>
	);
}
