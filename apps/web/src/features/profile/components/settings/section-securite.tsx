"use client";

import { useState } from "react";
import {
	Eye,
	EyeOff,
	Key,
	KeyRound,
	Loader2,
	LogOut,
	MapPin,
	Monitor,
	Smartphone,
} from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTRPC } from "@/trpc/client";
import { cn } from "@/lib/utils";
import { passwordSchema } from "@/features/profile/schemas";
import type { PasswordForm } from "@/features/profile/schemas";
import { Section } from "@/features/profile/components/section";
import { HeroCard } from "./hero-card";

function parseDevice(userAgent: string | null | undefined): { label: string; isMobile: boolean } {
	if (!userAgent) return { label: "Appareil inconnu", isMobile: false };
	const ua = userAgent.toLowerCase();
	const isMobile = /mobile|android|iphone|ipad/.test(ua);
	let browser = "Navigateur";
	if (ua.includes("edg/")) browser = "Edge";
	else if (ua.includes("firefox")) browser = "Firefox";
	else if (ua.includes("chrome")) browser = "Chrome";
	else if (ua.includes("safari")) browser = "Safari";
	let os = "";
	if (ua.includes("windows nt")) os = "Windows";
	else if (ua.includes("ipad")) os = "iPad";
	else if (ua.includes("macintosh") || ua.includes("mac os x")) os = "macOS";
	else if (ua.includes("android")) os = "Android";
	else if (ua.includes("iphone")) os = "iPhone";
	else if (ua.includes("linux")) os = "Linux";
	return { label: os ? `${browser} · ${os}` : browser, isMobile };
}

export function SectionSecurite() {
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	// Sessions resolved server-side — no raw IPs sent to the client
	const { data: sessions } = useQuery(trpc.user.listSessions.queryOptions());

	const [revokingId, setRevokingId] = useState<string | null>(null);

	const revokeSession = useMutation(
		trpc.user.revokeSession.mutationOptions({
			onSuccess: () => {
				toast.success("Appareil déconnecté");
				queryClient.invalidateQueries({
					queryKey: trpc.user.listSessions.queryOptions().queryKey,
				});
			},
			onError: () => toast.error("Impossible de déconnecter cet appareil"),
			onSettled: () => setRevokingId(null),
		})
	);

	function handleRevokeSession(sessionId: string) {
		setRevokingId(sessionId);
		revokeSession.mutate({ sessionId });
	}

	const [showCurrentPw, setShowCurrentPw] = useState(false);
	const [showNewPw, setShowNewPw] = useState(false);
	const [showConfirmPw, setShowConfirmPw] = useState(false);

	const passwordForm = useForm<PasswordForm>({
		resolver: zodResolver(passwordSchema),
		defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
	});

	const changePassword = useMutation(
		trpc.user.changePassword.mutationOptions({
			onSuccess: () => {
				toast.success("Mot de passe modifié");
				passwordForm.reset();
			},
			onError: (err) => toast.error(err.message),
		})
	);

	const fields = [
		{
			name: "currentPassword" as const,
			label: "Mot de passe actuel",
			show: showCurrentPw,
			toggle: () => setShowCurrentPw((v) => !v),
		},
		{
			name: "newPassword" as const,
			label: "Nouveau mot de passe",
			show: showNewPw,
			toggle: () => setShowNewPw((v) => !v),
		},
		{
			name: "confirmPassword" as const,
			label: "Confirmer le mot de passe",
			show: showConfirmPw,
			toggle: () => setShowConfirmPw((v) => !v),
		},
	] as const;

	return (
		<>
			<HeroCard />

			<Section icon={KeyRound} title="Changer de mot de passe">
				<form
					onSubmit={passwordForm.handleSubmit((data) =>
						changePassword.mutate({
							currentPassword: data.currentPassword,
							newPassword: data.newPassword,
						})
					)}
					className="space-y-3"
				>
					{fields.map(({ name, label, show, toggle }) => (
						<div key={name}>
							<label className="mb-1.5 block text-[12px] text-white/40">
								{label}
							</label>
							<div className="relative">
								<input
									{...passwordForm.register(name)}
									type={show ? "text" : "password"}
									className={cn(
										"w-full rounded-xl border bg-white/4 px-4 py-2.5 pr-10 text-sm text-white placeholder-white/20 transition-colors outline-none",
										passwordForm.formState.errors[name]
											? "border-red-500/40"
											: "border-white/8 focus:border-white/20"
									)}
								/>
								<button
									type="button"
									onClick={toggle}
									className="absolute top-1/2 right-3 -translate-y-1/2 text-white/25 transition-colors hover:text-white/50"
								>
									{show ? <EyeOff size={15} /> : <Eye size={15} />}
								</button>
							</div>
							{passwordForm.formState.errors[name] && (
								<p className="mt-1 text-[11px] text-red-400">
									{passwordForm.formState.errors[name]?.message}
								</p>
							)}
						</div>
					))}
					<div className="pt-1">
						<button
							type="submit"
							disabled={changePassword.isPending}
							className="flex items-center gap-2 rounded-xl bg-[#00D4FF]/10 px-5 py-2.5 text-[13px] font-medium text-[#00D4FF] ring-1 ring-[#00D4FF]/20 transition-colors hover:bg-[#00D4FF]/15 disabled:cursor-not-allowed disabled:opacity-40"
						>
							{changePassword.isPending ? (
								<Loader2 size={13} className="animate-spin" />
							) : (
								<KeyRound size={13} />
							)}
							Enregistrer
						</button>
					</div>
				</form>
			</Section>

			<Section icon={Key} title="Clés d'identification">
				<div className="flex items-center justify-between gap-4">
					<p className="text-[13px] text-white/50">
						Utilisez des passkeys pour vous connecter sans mot de passe.
					</p>
					<span className="shrink-0 rounded-full bg-white/5 px-3 py-1 text-[11px] text-white/25">
						Bientôt
					</span>
				</div>
			</Section>

			<Section icon={Monitor} title="Appareils connectés">
				<div className="space-y-2">
					{(sessions ?? []).map((s) => {
						const { label, isMobile } = parseDevice(s.userAgent);
						const isRevoking = revokingId === s.id;
						const cityLabel =
							s.city && s.country
								? `${s.city}, ${s.country}`
								: (s.city ?? s.country ?? null);
						return (
							<div
								key={s.id}
								className="flex items-center justify-between rounded-xl border border-white/6 bg-white/3 px-4 py-3"
							>
								<div className="flex items-center gap-3">
									<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5">
										{isMobile ? (
											<Smartphone size={13} className="text-white/35" />
										) : (
											<Monitor size={13} className="text-white/35" />
										)}
									</div>
									<div>
										<p className="text-[13px] text-white/60">{label}</p>
										<div className="mt-0.5 flex items-center gap-2">
											<p className="text-[11px] text-white/25">
												{new Date(s.createdAt).toLocaleDateString("fr-FR", {
													day: "numeric",
													month: "long",
													year: "numeric",
												})}
											</p>
											{cityLabel && (
												<span className="flex items-center gap-1 text-[11px] text-white/25">
													<span className="text-white/10">·</span>
													<MapPin size={9} className="text-white/20" />
													{cityLabel}
												</span>
											)}
										</div>
									</div>
								</div>
								{s.isCurrent ? (
									<span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] text-emerald-400/70">
										Actuelle
									</span>
								) : (
									<button
										type="button"
										onClick={() => handleRevokeSession(s.id)}
										disabled={isRevoking}
										className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] text-red-400/60 transition-colors hover:bg-red-500/8 hover:text-red-400 disabled:opacity-40"
									>
										{isRevoking ? (
											<Loader2 size={11} className="animate-spin" />
										) : (
											<LogOut size={11} />
										)}
										Déconnecter
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
