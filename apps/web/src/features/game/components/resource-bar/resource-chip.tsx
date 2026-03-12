"use client";

import { memo, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { formatRate, formatValue } from "../../lib/format-resource";
import type { DisplayResource } from "@/types";

interface ResourceChipProps {
	resource: DisplayResource;
}

function getBarColor(pct: number): string {
	if (pct > 80) return "#FF4422";
	if (pct > 50) return "#FFBB44";
	return "#22C55E";
}

/** Interpolates amount locally at 20 tps using the last known rate. */
function useInterpolatedAmount(amount: number, rate: number): number {
	const [display, setDisplay] = useState(amount);
	const baseRef = useRef<{ amount: number; rate: number; ts: number } | null>(null);

	// When a new poll arrives, reset the base
	useEffect(() => {
		const ts = Date.now();
		baseRef.current = { amount, rate, ts };
		const id = setTimeout(() => setDisplay(amount), 0);
		return () => clearTimeout(id);
	}, [amount, rate]);

	useEffect(() => {
		if (rate === 0) return;
		const id = setInterval(() => {
			if (!baseRef.current) return;
			const { amount: base, rate: r, ts } = baseRef.current;
			const elapsed = (Date.now() - ts) / 1_000;
			setDisplay(base + r * elapsed);
		}, 50);
		return () => clearInterval(id);
	}, [rate]);

	return display;
}

export const ResourceChip = memo(function ResourceChip({ resource }: ResourceChipProps) {
	const { config, amount, rate } = resource;
	const { icon: Icon, label, color, maxStorage } = config;

	const interpolated = useInterpolatedAmount(amount, rate);
	const pct = maxStorage > 0 ? Math.min(100, Math.max(0, (interpolated / maxStorage) * 100)) : 0;
	const barColor = getBarColor(pct);
	const displayRate = formatRate(rate);

	const isPositive = rate > 0.01;
	const isNegative = rate < -0.01;

	return (
		<div className="group relative flex min-w-28 shrink-0 flex-col gap-1.5 rounded-xl border border-white/7 bg-white/3 px-2 py-1.5 transition-colors duration-200 hover:border-white/12 hover:bg-white/5.5 sm:min-w-37 sm:px-3 sm:py-2">
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
					<span className="font-mono text-[15px] leading-none font-bold text-white">
						{formatValue(interpolated)}
					</span>

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
