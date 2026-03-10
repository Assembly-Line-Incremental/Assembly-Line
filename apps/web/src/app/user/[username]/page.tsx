import {
	ArrowLeft,
	Calendar,
	Flame,
	Lock,
	Pencil,
	RotateCcw,
	Shield,
	Trophy,
	Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { caller } from "@/trpc/server";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { getAvatarColor, getInitials, STATUS_CONFIG } from "@/features/profile/constants";
import { NavUserMenu } from "@/features/profile/components/nav-user-menu";

function safeDecodeUsername(username: string): string {
	try {
		return decodeURIComponent(username);
	} catch {
		notFound();
	}
}

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
	const { username } = await params;
	const name = safeDecodeUsername(username);
	const ogImage = `/api/og/user?name=${encodeURIComponent(name)}`;
	return {
		title: `${name} · Assembly Line`,
		openGraph: {
			title: `${name} · Assembly Line`,
			images: [{ url: ogImage, width: 1200, height: 630 }],
		},
		twitter: {
			card: "summary_large_image",
			images: [ogImage],
		},
	};
}

const BG_GRID = (
	<div
		className="pointer-events-none fixed inset-0 opacity-[0.02]"
		style={{
			backgroundImage:
				"linear-gradient(rgba(0,212,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,1) 1px, transparent 1px)",
			backgroundSize: "60px 60px",
		}}
	/>
);

function SectionHeader({
	icon: Icon,
	title,
	count,
}: {
	icon: React.ElementType;
	title: string;
	count?: number;
}) {
	return (
		<div className="flex items-center gap-3 border-b border-white/5 px-5 py-4">
			<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5">
				<Icon size={13} className="text-white/40" />
			</div>
			<h2 className="text-[13px] font-semibold text-white/60">{title}</h2>
			{count !== undefined && (
				<span className="ml-auto rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-white/30">
					{count}
				</span>
			)}
		</div>
	);
}

export default async function UserProfilePage({
	params,
}: {
	params: Promise<{ username: string }>;
}) {
	const { username } = await params;
	const decodedUsername = safeDecodeUsername(username);

	const session = await auth.api.getSession({ headers: await headers() });
	const isOwner = session?.user.name?.toLowerCase() === decodedUsername.toLowerCase();
	const profile = isOwner
		? await caller.user.getMe()
		: await caller.user.getPublicProfile({ username: decodedUsername });

	// ── Not found ──
	if (!profile) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-[#0A1A2F]">
				{BG_GRID}
				<div className="relative text-center">
					<p className="text-6xl font-black text-white/5">404</p>
					<p className="mt-2 text-[15px] font-semibold text-white/50">
						Joueur introuvable
					</p>
					<p className="mt-1 text-[13px] text-white/25">
						L&apos;utilisateur{" "}
						<span className="font-mono text-white/40">{decodedUsername}</span>{" "}
						n&apos;existe pas.
					</p>
					<Link
						href="/play"
						className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/8 bg-white/4 px-4 py-2 text-[13px] text-white/50 transition-colors hover:bg-white/6 hover:text-white/70"
					>
						<ArrowLeft size={14} />
						Retour au jeu
					</Link>
				</div>
			</div>
		);
	}

	const color = getAvatarColor(profile.name);
	const initials = getInitials(profile.name);
	const statusCfg = STATUS_CONFIG[profile.presenceStatus] ?? STATUS_CONFIG.OFFLINE;
	const supporter = profile.supporter;

	const createdAt = new Date(profile.createdAt).toLocaleDateString("fr-FR", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});

	// ── Private profile (non-owners only) ──
	if (!isOwner && !profile.isPublic) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-[#0A1A2F]">
				{BG_GRID}
				<div className="relative text-center">
					<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/4 ring-1 ring-white/8">
						<Lock size={24} className="text-white/30" />
					</div>
					<p className="text-[15px] font-semibold text-white/50">Profil privé</p>
					<p className="mt-1 text-[13px] text-white/25">
						<span className="font-semibold text-white/40">{profile.name}</span> a rendu
						son profil privé.
					</p>
					<Link
						href="/play"
						className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/8 bg-white/4 px-4 py-2 text-[13px] text-white/50 transition-colors hover:bg-white/6 hover:text-white/70"
					>
						<ArrowLeft size={14} />
						Retour au jeu
					</Link>
				</div>
			</div>
		);
	}

	// ── Public profile ──
	return (
		<div className="min-h-screen bg-[#0A1A2F]">
			{BG_GRID}

			{/* Header */}
			<header className="fixed inset-x-0 top-0 z-50 border-b border-white/6 bg-[#0A1A2F]/92 backdrop-blur-xl">
				<div
					className="pointer-events-none absolute inset-x-0 top-0 h-px"
					style={{
						background:
							"linear-gradient(to right, transparent 5%, #00D4FF20 40%, #FF772320 60%, transparent 95%)",
					}}
					aria-hidden={true}
				/>
				<div className="flex h-17 items-center gap-3 px-4">
					<Link
						href="/play"
						className="flex shrink-0 items-center gap-2.5 opacity-90 transition-opacity hover:opacity-100"
					>
						<Image
							src="/logo-icon.svg"
							alt="Assembly Line"
							width={28}
							height={28}
							className="h-7 w-7"
						/>
						<span className="hidden text-[16px] font-bold tracking-tight sm:block">
							<span className="text-white/75">Assembly </span>
							<span className="text-[#FF7733]">Line</span>
						</span>
					</Link>
					<div className="h-6 w-px shrink-0 bg-white/8" />
					<div className="flex flex-1 items-center gap-2 overflow-x-auto py-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
						<Link
							href="/play"
							className="flex items-center gap-1.5 text-[13px] text-white/40 transition-colors hover:text-white/70"
						>
							<ArrowLeft size={15} />
							Retour
						</Link>
					</div>

					<NavUserMenu />
				</div>
			</header>

			<main className="mx-auto max-w-3xl space-y-5 px-4 pt-[calc(4.25rem+2rem)] pb-12">
				{/* ── Hero ── */}
				<div className="relative overflow-hidden rounded-2xl border border-white/6 bg-gradient-to-br from-[#0D2035]/80 to-[#080F17]/80 p-8">
					{isOwner && (
						<Link
							href="/profile/settings"
							className="absolute top-4 right-4 z-10 flex items-center gap-1.5 rounded-xl border border-white/8 bg-white/5 px-3 py-1.5 text-[12px] text-white/45 transition-colors hover:bg-white/8 hover:text-white/70"
						>
							<Pencil size={12} />
							Modifier
						</Link>
					)}
					{/* Color glow */}
					<div
						className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full opacity-15 blur-3xl"
						style={{ backgroundColor: color.text }}
					/>

					<div className="relative flex flex-col items-center text-center sm:flex-row sm:items-start sm:gap-6 sm:text-left">
						{/* Avatar */}
						<div className="relative mb-4 shrink-0 sm:mb-0">
							{profile.image ? (
								<Image
									src={profile.image}
									alt={profile.name}
									width={96}
									height={96}
									className="h-24 w-24 rounded-2xl object-cover ring-2"
									style={{ "--tw-ring-color": color.ring } as React.CSSProperties}
								/>
							) : (
								<div
									className="flex h-24 w-24 items-center justify-center rounded-2xl text-3xl font-bold ring-2"
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
							{/* Online pulse */}
							{statusCfg.pulse && (
								<span className="absolute -right-1 -bottom-1 flex h-4 w-4">
									<span
										className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
										style={{ backgroundColor: statusCfg.color }}
									/>
									<span
										className="relative inline-flex h-4 w-4 rounded-full ring-2 ring-[#0D2035]"
										style={{ backgroundColor: statusCfg.color }}
									/>
								</span>
							)}
						</div>

						{/* Info */}
						<div className="flex-1">
							<div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center">
								<h1 className="text-2xl font-bold text-white">{profile.name}</h1>
								{supporter?.isActive && (
									<span
										className={cn(
											"flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase",
											supporter.tier === "GOLD" &&
												"bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20",
											supporter.tier === "SILVER" &&
												"bg-slate-400/10 text-slate-300 ring-1 ring-slate-400/20",
											supporter.tier === "BRONZE" &&
												"bg-orange-700/10 text-orange-400 ring-1 ring-orange-700/20"
										)}
									>
										<Zap size={9} />
										{supporter.tier}
									</span>
								)}
							</div>

							<div className="mt-2 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
								<div className="flex items-center gap-1.5 text-[12px] text-white/35">
									<Calendar size={11} />
									Membre depuis le {createdAt}
								</div>
							</div>

							{/* Quick stats */}
							<div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
								<div className="flex items-center gap-1.5 rounded-lg bg-white/4 px-2.5 py-1 text-[11px] text-white/40">
									<Shield size={11} />
									{profile.achievements.length} succès
								</div>
								<div className="flex items-center gap-1.5 rounded-lg bg-white/4 px-2.5 py-1 text-[11px] text-white/40">
									<Zap size={11} />
									{profile._count.gameSaves} sauvegarde
									{profile._count.gameSaves > 1 ? "s" : ""}
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* ── Classements ── */}
				<div className="overflow-hidden rounded-2xl border border-white/6 bg-[#0D2035]/80">
					<SectionHeader icon={Trophy} title="Classements" />
					<div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
						{(
							[
								{ label: "Production totale", key: "TOTAL_PRODUCTION" },
								{ label: "Speed run", key: "SPEED_RUN" },
								{ label: "Prestiges", key: "PRESTIGE_COUNT" },
								{ label: "Ère atteinte", key: "ERA_REACHED" },
							] as const
						).map(({ label, key }) => (
							<div
								key={key}
								className="flex flex-col gap-1.5 rounded-xl border border-white/5 bg-white/2 px-3 py-3"
							>
								<p className="text-[10px] tracking-wider text-white/30 uppercase">
									{label}
								</p>
								<p className="text-xl font-bold text-white/10">—</p>
								<p className="text-[10px] text-white/20">Bientôt disponible</p>
							</div>
						))}
					</div>
				</div>

				{/* ── Sauvegardes ── */}
				{profile.gameSaves.length > 0 && (
					<div className="overflow-hidden rounded-2xl border border-white/6 bg-[#0D2035]/80">
						<SectionHeader
							icon={Zap}
							title="Sauvegardes"
							count={profile.gameSaves.length}
						/>
						<div className="divide-y divide-white/4">
							{profile.gameSaves.map((save) => (
								<div key={save.id} className="flex items-center gap-4 px-5 py-4">
									{/* Slot badge */}
									<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-white/4 text-[13px] font-bold text-white/40">
										{save.slot}
									</div>

									<div className="min-w-0 flex-1">
										<div className="flex items-center gap-2">
											<p className="truncate text-[13px] font-semibold text-white/80">
												{save.name}
											</p>
											{save.isHardcore && (
												<span className="flex items-center gap-1 rounded-md bg-red-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-red-400/80 ring-1 ring-red-500/20">
													<Flame size={9} />
													Hardcore
												</span>
											)}
										</div>
										<p className="mt-0.5 text-[11px] text-white/30">
											Créée le{" "}
											{new Date(save.createdAt).toLocaleDateString("fr-FR", {
												day: "numeric",
												month: "short",
												year: "numeric",
											})}
										</p>
									</div>

									<div className="flex shrink-0 items-center gap-3">
										<div className="text-right">
											<p className="text-[12px] font-semibold text-white/60">
												Ère {save.currentEra}
											</p>
											{save.prestigeCount > 0 && (
												<p className="mt-0.5 flex items-center justify-end gap-1 text-[10px] text-white/30">
													<RotateCcw size={9} />
													{save.prestigeCount}×
												</p>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* ── Succès ── */}
				{profile.achievements.length > 0 && (
					<div className="overflow-hidden rounded-2xl border border-white/6 bg-[#0D2035]/80">
						<SectionHeader
							icon={Shield}
							title="Succès débloqués"
							count={profile.achievements.length}
						/>
						<div className="flex flex-wrap gap-2 p-4">
							{profile.achievements.map((a) => (
								<div
									key={a.slug}
									className="flex items-center gap-2 rounded-lg border border-white/6 bg-white/3 px-3 py-1.5"
									title={new Date(a.unlockedAt).toLocaleDateString("fr-FR")}
								>
									<Shield size={11} className="text-amber-400/60" />
									<span className="text-[12px] text-white/50" title={a.slug}>
										{a.slug
											.replace(/_/g, " ")
											.replace(/(^|\s)\S/g, (c) => c.toUpperCase())}
									</span>
								</div>
							))}
						</div>
					</div>
				)}
			</main>
		</div>
	);
}
