"use client";

import { Globe, Loader2, Lock, Shield, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { authClient } from "@/lib/auth/auth-client";
import { useTRPC } from "@/trpc/client";
import { cn } from "@/lib/utils";
import { getAvatarColor, getInitials } from "@/features/profile/constants";

interface HeroCardProps {
	isUploading?: boolean;
	uploadProgress?: number;
}

export function HeroCard({ isUploading = false, uploadProgress = 0 }: HeroCardProps) {
	const { data: session } = authClient.useSession();
	const trpc = useTRPC();
	const { data: profile } = useQuery(trpc.user.getMe.queryOptions());

	const [imageError, setImageError] = useState(false);

	const name = profile?.name ?? session?.user.name ?? "";
	const email = profile?.email ?? session?.user.email ?? "";
	const image = profile?.image ?? null;
	const color = getAvatarColor(name);
	const initials = getInitials(name);
	const createdAt = profile?.createdAt
		? new Date(profile.createdAt).toLocaleDateString("fr-FR", {
				day: "numeric",
				month: "long",
				year: "numeric",
			})
		: null;

	return (
		<div className="relative overflow-hidden rounded-2xl border border-white/6 bg-gradient-to-br from-[#0D2035]/80 to-[#080F17]/80 p-6">
			<div
				className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full opacity-20 blur-3xl"
				style={{ backgroundColor: color.text }}
			/>
			<div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
				<div className="relative shrink-0">
					{image && !imageError ? (
						<img
							src={image}
							alt={name}
							className="h-20 w-20 rounded-2xl object-cover ring-2"
							style={{ "--tw-ring-color": color.ring } as React.CSSProperties}
							onError={() => setImageError(true)}
						/>
					) : (
						<div
							className="flex h-20 w-20 items-center justify-center rounded-2xl text-2xl font-bold ring-2"
							style={
								{
									backgroundColor: color.bg,
									color: color.text,
									"--tw-ring-color": color.ring,
								} as React.CSSProperties
							}
						>
							{initials || "?"}
						</div>
					)}
					{isUploading && (
						<div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/60">
							<div className="text-center">
								<Loader2 size={20} className="mx-auto animate-spin text-white" />
								<span className="mt-1 block text-[10px] text-white/70">
									{uploadProgress}%
								</span>
							</div>
						</div>
					)}
				</div>
				<div className="min-w-0 flex-1">
					<h1 className="text-xl font-bold text-white">{name}</h1>
					<p className="mt-0.5 text-[13px] text-white/40">{email}</p>
					{createdAt && (
						<p className="mt-1 text-[12px] text-white/25">
							Membre depuis le {createdAt}
						</p>
					)}
					<div className="mt-3 flex flex-wrap gap-2">
						{profile && (
							<div className="flex items-center gap-1.5 rounded-lg bg-white/4 px-2.5 py-1 text-[11px] text-white/40">
								<Shield size={11} />
								{profile.achievements.length} succès
							</div>
						)}
						{profile && (
							<div className="flex items-center gap-1.5 rounded-lg bg-white/4 px-2.5 py-1 text-[11px] text-white/40">
								<Zap size={11} />
								{profile._count.gameSaves} sauvegarde
								{profile._count.gameSaves > 1 ? "s" : ""}
							</div>
						)}
						{profile && (
							<div
								className={cn(
									"flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px]",
									profile.isPublic
										? "bg-emerald-500/8 text-emerald-400/70"
										: "bg-white/4 text-white/30"
								)}
							>
								{profile.isPublic ? <Globe size={11} /> : <Lock size={11} />}
								{profile.isPublic ? "Public" : "Privé"}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
