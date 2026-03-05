"use client";

import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { useGameResources } from "../../hooks/use-game-resources";
import { UserMenu } from "../user-menu";
import { ResourceChip } from "./resource-chip";

export const ResourceHeader = memo(function ResourceHeader() {
	const { resources, isLoading } = useGameResources();

	return (
		<header className="fixed inset-x-0 top-0 z-50 border-b border-white/6 bg-[#0A1A2F]/92 backdrop-blur-xl">
			{/* Subtle top-of-page glow strip */}
			<div
				className="pointer-events-none absolute inset-x-0 top-0 h-px"
				style={{
					background:
						"linear-gradient(to right, transparent 5%, #00D4FF20 40%, #FF772320 60%, transparent 95%)",
				}}
				aria-hidden
			/>

			<div className="flex h-17 items-center gap-3 px-4">
				{/* ── Logo ───────────────────────────────────────────── */}
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

				{/* Divider */}
				<div className="h-6 w-px shrink-0 bg-white/8" />

				{/* ── Resource chips (horizontal scroll on mobile) ───── */}
				<div
					className="flex flex-1 items-center gap-2 overflow-x-auto py-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
					role="region"
					aria-label="Resources"
				>
					{isLoading &&
						Array.from({ length: 5 }).map((_, i) => (
							<Skeleton
								key={i}
								className="h-11.5 w-37 shrink-0 rounded-xl bg-white/5"
							/>
						))}

					{!isLoading && resources.map((r) => <ResourceChip key={r.type} resource={r} />)}

					{!isLoading && resources.length === 0 && (
						<p className="text-xs text-white/25">Start a game to see your resources.</p>
					)}
				</div>

				{/* ── User menu ──────────────────────────────────────── */}
				<UserMenu />
			</div>
		</header>
	);
});
