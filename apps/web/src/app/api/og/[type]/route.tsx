import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { env } from "@/env";
import { caller } from "@/trpc/server";

const W = 1200;
const H = 630;

const CONTENT = {
	default: {
		eyebrow: "Incremental · Idle Game",
		line1: "ASSEMBLY",
		line2: "LINE",
		tagline: "Build machines. Chain resources. Optimize endlessly.",
	},
	game: {
		eyebrow: "Free to Play · Build Your Factory",
		line1: "YOUR FACTORY",
		line2: "AWAITS",
		tagline: "Build machines. Chain resources. Optimize endlessly.",
	},
	leaderboard: {
		eyebrow: "Global Rankings",
		line1: "TOP FACTORY",
		line2: "BUILDERS",
		tagline: "Compete with players worldwide.",
	},
	user: {
		eyebrow: "Player Profile · Assembly Line",
		line1: "",
		line2: "",
		tagline: "Track progress, achievements and factory stats.",
	},
} as const;

type OgType = keyof typeof CONTENT;

export async function GET(req: Request, { params }: { params: Promise<{ type: string }> }) {
	const { type } = await params;

	if (!(type in CONTENT)) {
		notFound();
	}

	const url = new URL(req.url);
	const rawUsername = url.searchParams.get("name");
	const USERNAME_RE = /^[a-zA-Z0-9_-]{3,20}$/;
	const username = rawUsername && USERNAME_RE.test(rawUsername) ? rawUsername : null;

	const base = CONTENT[type as OgType];
	const eyebrow = base.eyebrow;
	const tagline = base.tagline;
	const hostname = new URL(env.NEXT_PUBLIC_URL).hostname;

	const isUser = type === "user";

	// Fetch profile data for user OG
	let line1 = isUser && username ? username.toUpperCase() : base.line1;
	const line2 = isUser ? "ASSEMBLY LINE" : base.line2;

	const statItems: { value: string; label: string }[] = [];
	if (isUser && username) {
		try {
			const profile = await caller.user.getPublicProfile({ username });
			if (profile?.isPublic) {
				if (profile.name) line1 = profile.name.toUpperCase();
				const maxEra = profile.gameSaves.reduce((max, s) => Math.max(max, s.currentEra), 0);
				const totalPrestiges = profile.gameSaves.reduce(
					(sum, s) => sum + s.prestigeCount,
					0
				);
				if (profile._count.gameSaves > 0)
					statItems.push({
						value: String(profile._count.gameSaves),
						label: profile._count.gameSaves === 1 ? "Sauvegarde" : "Sauvegardes",
					});
				if (profile.achievements.length > 0)
					statItems.push({ value: String(profile.achievements.length), label: "Succès" });
				if (maxEra > 1) statItems.push({ value: `Ère ${maxEra}`, label: "Meilleure ère" });
				if (totalPrestiges > 0)
					statItems.push({ value: `${totalPrestiges}×`, label: "Prestiges" });
			}
		} catch {
			// silently ignore — show username only
		}
	}

	const hasStats = statItems.length > 0;

	return new ImageResponse(
		<div
			style={{
				width: W,
				height: H,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				background: "#0A1A2F",
				fontFamily: "sans-serif",
				position: "relative",
				overflow: "hidden",
			}}
		>
			{/* Subtle grid */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					backgroundImage:
						"linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)",
					backgroundSize: "80px 80px",
					display: "flex",
				}}
			/>

			{/* Central radial glow — cyan */}
			<div
				style={{
					position: "absolute",
					top: "50%",
					left: "50%",
					width: 900,
					height: 900,
					marginTop: -450,
					marginLeft: -450,
					borderRadius: "50%",
					background:
						"radial-gradient(circle, rgba(0,212,255,0.07) 0%, rgba(255,68,34,0.04) 40%, transparent 65%)",
					display: "flex",
				}}
			/>

			{/* Bottom-left warm glow */}
			<div
				style={{
					position: "absolute",
					bottom: -150,
					left: -150,
					width: 500,
					height: 500,
					borderRadius: "50%",
					background:
						"radial-gradient(circle, rgba(255,119,51,0.08) 0%, transparent 70%)",
					display: "flex",
				}}
			/>

			{/* Top-right cool glow */}
			<div
				style={{
					position: "absolute",
					top: -100,
					right: -100,
					width: 400,
					height: 400,
					borderRadius: "50%",
					background: "radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)",
					display: "flex",
				}}
			/>

			{/* Content — centered column */}
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: 0,
					position: "relative",
				}}
			>
				{/* Eyebrow badge */}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						border: "1px solid rgba(0,212,255,0.25)",
						borderRadius: 9999,
						padding: "8px 24px",
						marginBottom: 40,
						background: "rgba(0,212,255,0.06)",
					}}
				>
					<span
						style={{
							fontSize: 18,
							fontWeight: 600,
							color: "rgba(0,212,255,0.9)",
							letterSpacing: "0.14em",
							textTransform: "uppercase",
						}}
					>
						{eyebrow}
					</span>
				</div>

				{/* Title line 1 — white */}
				<span
					style={{
						fontSize: 110,
						fontWeight: 900,
						color: "#FFFFFF",
						letterSpacing: "-0.03em",
						lineHeight: 1,
						textAlign: "center",
						maxWidth: 1060,
					}}
				>
					{line1}
				</span>

				{/* Title line 2 — fire orange (non-user only) */}
				{!isUser && (
					<span
						style={{
							fontSize: 110,
							fontWeight: 900,
							color: "#FF7733",
							letterSpacing: "-0.03em",
							lineHeight: 1,
							textAlign: "center",
							marginBottom: 40,
						}}
					>
						{line2}
					</span>
				)}

				{/* Stats row — user type */}
				{isUser && hasStats && (
					<div
						style={{
							display: "flex",
							alignItems: "center",
							marginTop: 44,
							paddingTop: 36,
							borderTop: "1px solid rgba(255,255,255,0.08)",
						}}
					>
						{statItems.map((stat, i) => (
							<div key={stat.label} style={{ display: "flex", alignItems: "center" }}>
								{i > 0 && (
									<div
										style={{
											width: 1,
											height: 40,
											background: "rgba(255,255,255,0.10)",
											margin: "0 40px",
											display: "flex",
										}}
									/>
								)}
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										gap: 8,
									}}
								>
									<span
										style={{
											fontSize: 40,
											fontWeight: 800,
											color: "#FFFFFF",
											lineHeight: 1,
										}}
									>
										{stat.value}
									</span>
									<span
										style={{
											fontSize: 14,
											fontWeight: 500,
											color: "rgba(255,255,255,0.35)",
											letterSpacing: "0.12em",
											textTransform: "uppercase",
										}}
									>
										{stat.label}
									</span>
								</div>
							</div>
						))}
					</div>
				)}

				{/* Tagline — non-user types, or user with no stats */}
				{(!isUser || !hasStats) && (
					<span
						style={{
							fontSize: 26,
							fontWeight: 400,
							color: "rgba(139,163,185,0.85)",
							letterSpacing: "0.01em",
							textAlign: "center",
							maxWidth: 700,
							marginTop: isUser ? 32 : 0,
						}}
					>
						{tagline}
					</span>
				)}
			</div>

			{/* Bottom cyan/orange gradient line */}
			<div
				style={{
					position: "absolute",
					bottom: 0,
					left: 0,
					right: 0,
					height: 2,
					background:
						"linear-gradient(90deg, transparent, rgba(0,212,255,0.6) 30%, rgba(255,119,51,0.6) 70%, transparent)",
					display: "flex",
				}}
			/>

			{/* Site name — bottom left */}
			<div
				style={{
					position: "absolute",
					bottom: 28,
					left: 52,
					display: "flex",
					alignItems: "center",
					gap: 10,
				}}
			>
				<span
					style={{
						fontSize: 16,
						fontWeight: 700,
						color: "rgba(255,255,255,0.25)",
						letterSpacing: "0.12em",
						textTransform: "uppercase",
					}}
				>
					{hostname}
				</span>
			</div>
		</div>,
		{
			width: W,
			height: H,
			headers: {
				"Cache-Control":
					type === "user"
						? "public, max-age=3600, stale-while-revalidate=86400"
						: "public, max-age=86400, immutable",
			},
		}
	);
}
