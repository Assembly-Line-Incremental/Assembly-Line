"use client";

import { memo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { formatRate, formatValue } from "../lib/format-resource";
import type { DisplayResource } from "@/types";

interface ResourceChipProps {
	resource: DisplayResource;
}

function getBarColor(pct: number): string {
	if (pct > 80) return "#FF4422";
	if (pct > 50) return "#FFBB44";
	return "#22C55E";
}

export const ResourceChip = memo(function ResourceChip({ resource }: ResourceChipProps) {
	const { config, amount, rate } = resource;
	const { icon: Icon, label, color, maxStorage } = config;

	const pct = maxStorage > 0 ? Math.min(100, Math.max(0, (amount / maxStorage) * 100)) : 0;
	const barColor = getBarColor(pct);
	const displayValue = formatValue(amount);
	const displayRate = formatRate(rate);

	const isPositive = rate > 0.01;
	const isNegative = rate < -0.01;

	return (
		<div className="group relative flex min-w-37 shrink-0 flex-col gap-1.5 rounded-xl border border-white/7 bg-white/3 px-3 py-2 transition-colors duration-200 hover:border-white/12 hover:bg-white/5.5">
			{/* Top-edge accent on hover */}
			<div
				className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
				style={{
					background: `linear-gradient(to right, transparent, ${color}55, transparent)`,
				}}
				aria-hidden
			/>

			{/* Single info row: icon · label · value · rate */}
			<div className="flex items-center gap-2">
				{/* Icon badge */}
				<div
					className="flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-lg"
					style={{ backgroundColor: `${color}15` }}
				>
					<Icon size={12} style={{ color }} strokeWidth={2.5} />
				</div>

				{/* Label */}
				<span className="text-[11px] font-medium tracking-widest text-white/30 uppercase">
					{label}
				</span>

				{/* Push value+rate to the right */}
				<div className="ml-auto flex items-baseline gap-1.25">
					<AnimatePresence mode="wait" initial={false}>
						<motion.span
							key={displayValue}
							initial={{ opacity: 0.4, y: -3 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 3 }}
							transition={{ duration: 0.15, ease: "easeOut" }}
							className="font-mono text-[15px] leading-none font-bold text-white"
						>
							{displayValue}
						</motion.span>
					</AnimatePresence>

					<span
						className={cn(
							"font-mono text-[11px] leading-none tabular-nums",
							isPositive && "text-[#22C55E]",
							isNegative && "text-[#FF4422]",
							!isPositive && !isNegative && "text-white/20"
						)}
					>
						{displayRate}
					</span>
				</div>
			</div>

			{/* Storage bar — 2.5 px */}
			<div className="h-0.5 w-full overflow-hidden rounded-full bg-white/8">
				<motion.div
					className="h-full rounded-full"
					style={{ backgroundColor: barColor }}
					initial={false}
					animate={{
						width: `${pct}%`,
						boxShadow: pct > 80 ? `0 0 4px ${barColor}90` : "none",
					}}
					transition={{ duration: 0.5, ease: "easeOut" }}
				/>
			</div>
		</div>
	);
});
