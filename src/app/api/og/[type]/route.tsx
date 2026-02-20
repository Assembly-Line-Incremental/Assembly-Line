import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { env } from "@/env";

export const runtime = "edge";

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
} as const;

type OgType = keyof typeof CONTENT;

export async function GET(_req: Request, { params }: { params: Promise<{ type: string }> }) {
	const { type } = await params;

	if (!(type in CONTENT)) {
		notFound();
	}

	const { eyebrow, line1, line2, tagline } = CONTENT[type as OgType];
	const hostname = new URL(env.NEXT_PUBLIC_URL).hostname;

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
					}}
				>
					{line1}
				</span>

				{/* Title line 2 — fire orange */}
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

				{/* Tagline */}
				<span
					style={{
						fontSize: 26,
						fontWeight: 400,
						color: "rgba(139,163,185,0.85)",
						letterSpacing: "0.01em",
						textAlign: "center",
						maxWidth: 700,
					}}
				>
					{tagline}
				</span>
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
		{ width: W, height: H }
	);
}
