"use client";

import { useRef } from "react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface FeatureCardProps {
	icon: LucideIcon;
	title: string;
	description: string;
	color: string;
}

export function FeatureCard({ icon: Icon, title, description, color }: FeatureCardProps) {
	const cardRef = useRef<HTMLDivElement>(null);

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		const card = cardRef.current;
		/* istanbul ignore next -- @preserve */
		if (!card) return;
		const rect = card.getBoundingClientRect();
		const x = ((e.clientX - rect.left) / rect.width) * 100;
		const y = ((e.clientY - rect.top) / rect.height) * 100;
		card.style.setProperty("--mouse-x", `${x}%`);
		card.style.setProperty("--mouse-y", `${y}%`);
	};

	return (
		<Card
			ref={cardRef}
			onMouseMove={handleMouseMove}
			className="group relative overflow-hidden border-white/6 bg-linear-to-b from-white/4 to-transparent py-0 shadow-none transition-all duration-500 hover:border-white/12 hover:shadow-[0_8px_40px_rgba(0,0,0,0.3)]"
		>
			{/* Mouse-following glow */}
			<div
				className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
				style={{
					background: `radial-gradient(500px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${color}08, transparent 40%)`,
				}}
			/>

			{/* Top edge highlight */}
			<div
				className="absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
				style={{
					background: `linear-gradient(to right, transparent, ${color}40, transparent)`,
				}}
			/>

			<CardContent className="relative p-7">
				<div
					className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-500 group-hover:scale-110"
					style={{ backgroundColor: `${color}12` }}
				>
					<Icon size={24} style={{ color }} />
				</div>
				<h3 className="mb-2.5 text-lg font-bold text-white">{title}</h3>
				<p className="text-sm leading-relaxed text-[#8BA3B9]/90">{description}</p>
			</CardContent>
		</Card>
	);
}
