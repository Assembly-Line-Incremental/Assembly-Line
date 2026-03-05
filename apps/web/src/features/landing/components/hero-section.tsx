"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ParticleField } from "./particle-field";

export function HeroSection() {
	return (
		<section className="relative flex min-h-[94vh] flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-16">
			<ParticleField />

			{/* Radial glow behind logo */}
			<div
				className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
				style={{
					width: 700,
					height: 700,
					background:
						"radial-gradient(circle, rgba(0,212,255,0.06) 0%, rgba(255,68,34,0.03) 40%, transparent 70%)",
				}}
				aria-hidden="true"
			/>

			{/* Secondary glow - warm */}
			<div
				className="pointer-events-none absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2"
				style={{
					width: 500,
					height: 500,
					background:
						"radial-gradient(circle, rgba(255,187,68,0.03) 0%, transparent 60%)",
				}}
				aria-hidden="true"
			/>

			{/* Content */}
			<div
				className="relative z-10 flex flex-col items-center text-center"
				style={{ animation: "fade-in-up 0.8s ease-out both" }}
			>
				{/* Logo */}
				<div className="relative mb-8 sm:mb-10">
					<div
						className="absolute inset-0 rounded-3xl"
						style={{
							background:
								"radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 70%)",
							filter: "blur(24px)",
							animation: "pulse-glow 4s ease-in-out infinite",
						}}
						aria-hidden="true"
					/>
					<Image
						src="/logo-icon.svg"
						alt="Assembly Line"
						width={160}
						height={160}
						priority
						className="relative h-28 w-28 drop-shadow-[0_0_50px_rgba(0,212,255,0.2)] sm:h-40 sm:w-40"
					/>
				</div>

				{/* Title */}
				<h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
					<span className="bg-linear-to-b from-white via-white to-white/70 bg-clip-text text-transparent">
						ASSEMBLY
					</span>
					<br />
					<span className="bg-linear-to-r from-[#FF4422] via-[#FF7733] to-[#FFBB44] bg-clip-text text-transparent">
						LINE
					</span>
				</h1>

				{/* Tagline */}
				<p className="mt-5 max-w-lg text-sm leading-relaxed text-[#8BA3B9]/90 sm:mt-7 sm:text-lg md:text-xl">
					Build machines. Chain resources. Optimize endlessly.
					<br />
					<span className="text-[#00D4FF]/60">The incremental factory game.</span>
				</p>

				{/* CTA */}
				<div className="mt-8 flex w-full max-w-sm flex-col items-stretch gap-3 sm:mt-12 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
					<Button
						asChild
						size="lg"
						className="h-12 rounded-2xl bg-linear-to-r from-[#00D4FF] to-[#0088BB] font-bold text-[#0A1A2F] shadow-[0_0_30px_rgba(0,212,255,0.2)] transition-all duration-300 hover:opacity-90 hover:shadow-[0_0_40px_rgba(0,212,255,0.3)] sm:h-14 sm:flex-4 sm:text-base"
					>
						<Link href="/play">
							<Play size={18} className="fill-current" />
							Play Now
						</Link>
					</Button>
					<Button
						asChild
						variant="outline"
						size="lg"
						className="h-12 rounded-2xl border-white/8 bg-white/3 font-medium text-white/70 backdrop-blur-sm transition-all duration-300 hover:border-[#00D4FF]/20 hover:bg-white/6 hover:text-white sm:h-14 sm:flex-3 sm:text-base"
					>
						<a href="#features">
							Learn More
							<ArrowRight size={16} />
						</a>
					</Button>
				</div>

				{/* Version badge */}
				<div className="mt-6 flex items-center gap-2.5 rounded-full border border-white/6 bg-white/2 px-4 py-1.5 text-[10px] text-white/25 backdrop-blur-sm sm:mt-10 sm:px-5 sm:py-2 sm:text-xs">
					<div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00D4FF]/60" />
					Early Development — v0.1 MVP
				</div>
			</div>
		</section>
	);
}
