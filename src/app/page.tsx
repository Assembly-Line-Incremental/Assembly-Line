"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronDown, Github, MessageCircle, Heart, Shield, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { HeroSection } from "@/components/landing/hero-section";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { AnimatedCounter } from "@/components/landing/animated-counter";
import { FeatureCard } from "@/components/landing/feature-card";
import { Navbar } from "@/components/landing/navbar";
import { ConveyorBelt } from "@/components/landing/conveyor-belt";
import { FEATURES, ERAS, PIPELINE_STEPS, STATS } from "@/components/landing/constants";

export default function Home() {
	return (
		<div className="relative min-h-screen overflow-x-hidden bg-[#0A1A2F]">
			<Navbar />

			{/* Hero */}
			<HeroSection />

			{/* Scroll indicator */}
			<div className="relative z-10 -mt-2 flex justify-center pb-6">
				<div className="flex flex-col items-center gap-2">
					<span className="text-[10px] font-medium tracking-[0.2em] text-[#00D4FF]/30 uppercase">
						Scroll
					</span>
					<ChevronDown
						className="text-[#00D4FF]/30"
						size={20}
						style={{ animation: "float-up 2.5s ease-in-out infinite" }}
					/>
				</div>
			</div>

			{/* Conveyor separator */}
			<ConveyorBelt />

			{/* Stats bar */}
			<section className="relative z-10 border-y border-[#00D4FF]/[0.07] bg-[#06101E]/80 backdrop-blur-md">
				<div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-6 py-8 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-10 md:gap-20 md:py-12">
					{STATS.map((stat, i) => (
						<ScrollReveal key={stat.label} delay={i * 100} direction="up" distance={20}>
							<div className="flex items-center gap-4">
								<div
									className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00D4FF]/8"
									style={{
										animation: "glow-pulse 4s ease-in-out infinite",
										animationDelay: `${i * 0.5}s`,
									}}
								>
									<stat.icon size={22} className="text-[#00D4FF]" />
								</div>
								<div>
									<AnimatedCounter
										value={stat.value}
										className="block text-3xl font-black tracking-tight text-white"
									/>
									<span className="text-xs font-medium tracking-[0.15em] text-[#00D4FF]/50 uppercase">
										{stat.label}
									</span>
								</div>
							</div>
						</ScrollReveal>
					))}
				</div>
			</section>

			{/* Features */}
			<section id="features" className="relative z-10 py-16 md:py-32">
				{/* Background decorative grid */}
				<div
					className="pointer-events-none absolute inset-0 opacity-[0.02]"
					style={{
						backgroundImage:
							"linear-gradient(rgba(0,212,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,1) 1px, transparent 1px)",
						backgroundSize: "60px 60px",
					}}
					aria-hidden="true"
				/>

				<div className="relative mx-auto max-w-6xl px-6">
					<ScrollReveal>
						<div className="mb-12 text-center md:mb-20">
							<Badge
								variant="outline"
								className="mb-5 border-[#00D4FF]/20 bg-[#00D4FF]/4 px-4 py-1.5 text-xs font-medium tracking-[0.15em] text-[#00D4FF]/80 uppercase"
							>
								Core Mechanics
							</Badge>
							<h2 className="text-4xl font-black tracking-tight text-white md:text-5xl">
								Build. Optimize.{" "}
								<span className="bg-linear-to-r from-[#FF4422] via-[#FF7733] to-[#FFBB44] bg-clip-text text-transparent">
									Dominate.
								</span>
							</h2>
							<p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#8BA3B9]/80">
								Every decision matters. Chain machines together, discover synergies,
								and push your factory beyond what you thought possible.
							</p>
						</div>
					</ScrollReveal>

					<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
						{FEATURES.map((feature, i) => (
							<ScrollReveal key={feature.title} delay={i * 80} distance={24}>
								<FeatureCard
									icon={feature.icon}
									title={feature.title}
									description={feature.description}
									color={feature.color}
								/>
							</ScrollReveal>
						))}
					</div>
				</div>
			</section>

			{/* Conveyor separator */}
			<ConveyorBelt />

			{/* How it works / Pipeline visual */}
			<section
				id="pipeline"
				className="relative z-10 overflow-hidden border-y border-[#00D4FF]/[0.07] bg-[#06101E]/40 py-16 md:py-32"
			>
				{/* Ambient glow */}
				<div
					className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
					style={{
						width: 800,
						height: 800,
						background:
							"radial-gradient(circle, rgba(0,212,255,0.03) 0%, transparent 70%)",
					}}
					aria-hidden="true"
				/>

				<div className="relative mx-auto max-w-5xl px-6">
					<ScrollReveal>
						<div className="mb-12 text-center md:mb-20">
							<Badge
								variant="outline"
								className="mb-5 border-[#FF7733]/20 bg-[#FF7733]/4 px-4 py-1.5 text-xs font-medium tracking-[0.15em] text-[#FF7733]/80 uppercase"
							>
								The Pipeline
							</Badge>
							<h2 className="text-4xl font-black tracking-tight text-white md:text-5xl">
								From raw matter to{" "}
								<span className="bg-linear-to-r from-[#00D4FF] to-[#0088BB] bg-clip-text text-transparent">
									galactic empire
								</span>
							</h2>
						</div>
					</ScrollReveal>

					<div className="relative">
						{/* Connection line */}
						<div className="absolute top-0 left-6 hidden h-full w-px md:left-1/2 md:block">
							<div className="h-full w-full bg-linear-to-b from-[#FFBB44]/20 via-[#FF4422]/20 to-[#00D4FF]/20" />
						</div>

						{PIPELINE_STEPS.map((item, index) => (
							<ScrollReveal
								key={item.step}
								delay={index * 120}
								direction={index % 2 === 0 ? "left" : "right"}
								distance={40}
								className={index < PIPELINE_STEPS.length - 1 ? "mb-8 md:mb-16" : ""}
							>
								<div
									className={`relative flex flex-col gap-4 pl-20 md:w-[calc(50%-24px)] md:pl-0 ${
										index % 2 === 0
											? "md:ml-0 md:pr-16 md:text-right"
											: "md:ml-auto md:pl-16"
									}`}
								>
									{/* Step dot - mobile */}
									<div
										className="absolute top-0 left-0 flex h-14 w-14 items-center justify-center rounded-2xl border md:hidden"
										style={{
											borderColor: `${item.color}30`,
											backgroundColor: `${item.color}08`,
										}}
									>
										<item.icon size={22} style={{ color: item.color }} />
									</div>

									{/* Timeline dot - desktop */}
									<div
										className="absolute top-3 hidden h-5 w-5 rounded-full md:block"
										style={{
											backgroundColor: item.color,
											boxShadow: `0 0 0 4px ${item.color}20, 0 0 12px ${item.color}30`,
											...(index % 2 === 0
												? { right: "-34px" }
												: { left: "-34px" }),
										}}
									>
										<span
											className="absolute -inset-1 rounded-full"
											style={{
												border: `1.5px solid ${item.color}30`,
												animation: "pulse-ring 2.5s ease-out infinite",
											}}
										/>
									</div>

									<div>
										<div
											className={`mb-2 flex items-center gap-3 ${index % 2 === 0 ? "md:justify-end" : "md:justify-start"}`}
										>
											<div
												className="hidden h-10 w-10 items-center justify-center rounded-xl md:flex"
												style={{
													backgroundColor: "rgba(255,255,255,0.04)",
													border: `1px solid ${item.color}20`,
													order: index % 2 === 0 ? 1 : 0,
												}}
											>
												<item.icon
													size={20}
													style={{ color: item.color }}
												/>
											</div>
											<span
												className="text-[11px] font-bold tracking-[0.2em] uppercase"
												style={{ color: `${item.color}AA` }}
											>
												Step {item.step}
											</span>
										</div>
										<h3 className="text-xl font-bold text-white">
											{item.title}
										</h3>
										<p className="mt-2 text-sm leading-relaxed text-[#8BA3B9]/80">
											{item.desc}
										</p>
									</div>
								</div>
							</ScrollReveal>
						))}
					</div>
				</div>
			</section>

			{/* Eras progression */}
			<section id="eras" className="relative z-10 py-16 md:py-32">
				<div className="mx-auto max-w-5xl px-6">
					<ScrollReveal>
						<div className="mb-12 text-center md:mb-20">
							<Badge
								variant="outline"
								className="mb-5 border-[#FFBB44]/20 bg-[#FFBB44]/4 px-4 py-1.5 text-xs font-medium tracking-[0.15em] text-[#FFBB44]/80 uppercase"
							>
								Progression
							</Badge>
							<h2 className="text-4xl font-black tracking-tight text-white md:text-5xl">
								Six eras of{" "}
								<span className="bg-linear-to-r from-[#FFBB44] via-[#FF7733] to-[#FF4422] bg-clip-text text-transparent">
									industrial evolution
								</span>
							</h2>
							<p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#8BA3B9]/80">
								Each era introduces new machines, resources, and challenges. How far
								can you push your factory?
							</p>
						</div>
					</ScrollReveal>

					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{ERAS.map((era, i) => (
							<ScrollReveal key={era.era} delay={i * 100} distance={20}>
								<Card
									className={`group relative overflow-hidden border-white/6 bg-white/2 py-0 shadow-none transition-all duration-500 hover:border-white/12 hover:bg-white/4 ${
										i % 3 === 1 ? "lg:mt-4" : ""
									}`}
								>
									{/* Colored left border */}
									<div
										className="absolute top-3 bottom-3 left-0 w-[3px] rounded-full opacity-60 transition-opacity duration-500 group-hover:opacity-100"
										style={{ backgroundColor: era.color }}
									/>

									{/* Large era number watermark */}
									<span
										className="pointer-events-none absolute -top-1 right-4 text-7xl leading-none font-black opacity-[0.08] transition-opacity duration-500 select-none group-hover:opacity-[0.15]"
										style={{ color: era.color }}
									>
										{era.era}
									</span>

									<CardHeader className="relative gap-3 px-6 py-5 pl-9">
										<div className="flex items-center gap-3">
											<div
												className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-transform duration-500 group-hover:scale-110"
												style={{
													backgroundColor: "rgba(255,255,255,0.03)",
													border: `1px solid ${era.color}25`,
												}}
											>
												<era.icon size={18} style={{ color: era.color }} />
											</div>
											<div className="flex items-center gap-2.5">
												<span
													className="text-[11px] font-bold tracking-[0.2em] uppercase"
													style={{ color: era.color }}
												>
													Era {era.era}
												</span>
												{i >= 4 && (
													<Badge
														variant="outline"
														className="border-[#FF4422]/20 bg-[#FF4422]/4 px-2 py-0.5 text-[10px] font-medium text-[#FF4422]/80"
													>
														Coming Soon
													</Badge>
												)}
											</div>
										</div>
										<CardTitle className="text-lg font-bold text-white">
											{era.name}
										</CardTitle>
										<CardDescription className="text-sm leading-relaxed text-[#8BA3B9]/70">
											{era.description}
										</CardDescription>
									</CardHeader>
								</Card>
							</ScrollReveal>
						))}
					</div>
				</div>
			</section>

			{/* Conveyor separator */}
			<ConveyorBelt />

			{/* Supporter tiers */}
			<section
				id="support"
				className="relative z-10 overflow-hidden border-y border-[#00D4FF]/[0.07] bg-[#06101E]/40 py-16 md:py-32"
			>
				<div className="mx-auto max-w-4xl px-6">
					<ScrollReveal>
						<div className="mb-12 text-center md:mb-20">
							<Badge
								variant="outline"
								className="mb-5 border-[#00D4FF]/20 bg-[#00D4FF]/4 px-4 py-1.5 text-xs font-medium tracking-[0.15em] text-[#00D4FF]/80 uppercase"
							>
								<Shield size={12} className="mr-1.5" />
								No Pay-to-Win
							</Badge>
							<h2 className="text-4xl font-black tracking-tight text-white md:text-5xl">
								Support the game,{" "}
								<span className="bg-linear-to-r from-[#00D4FF] to-[#FFBB44] bg-clip-text text-transparent">
									not an advantage
								</span>
							</h2>
							<p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-[#8BA3B9]/80">
								Boosts are capped at +15%. A free-to-play leaderboard ensures fair
								competition. Supporters get cosmetic perks and quality of life.
							</p>
						</div>
					</ScrollReveal>

					<div className="grid gap-5 sm:grid-cols-3">
						{[
							{
								tier: "Bronze",
								price: "5",
								period: "one-time",
								color: "#CD7F32",
								perks: ["Supporter badge", "+1 save slot", "Profile border"],
							},
							{
								tier: "Silver",
								price: "10",
								period: "/month",
								color: "#C0C0C0",
								popular: true,
								perks: [
									"+10% production",
									"+15% offline gains",
									"Exclusive themes",
									"Priority support",
								],
							},
							{
								tier: "Gold",
								price: "25",
								period: "/month",
								color: "#FFD700",
								perks: [
									"+15% production",
									"Supporter Era access",
									"Hardcore mode",
									"All Silver perks",
								],
							},
						].map((tier, i) => (
							<ScrollReveal key={tier.tier} delay={i * 120} distance={24}>
								<Card
									className={`group relative h-full overflow-hidden py-0 shadow-none transition-all duration-500 hover:shadow-[0_8px_40px_rgba(0,0,0,0.3)] ${
										tier.popular
											? "border-white/12 bg-white/4"
											: "border-white/6 bg-white/2 hover:border-white/12"
									}`}
								>
									{/* Top accent */}
									<div
										className="absolute inset-x-0 top-0 h-0.5"
										style={{
											background: `linear-gradient(to right, transparent, ${tier.color}80, transparent)`,
										}}
									/>

									{tier.popular && (
										<div className="absolute top-4 right-4">
											<Badge className="border-0 bg-white/10 text-[10px] font-bold tracking-wider text-white/70 uppercase">
												Popular
											</Badge>
										</div>
									)}

									<CardHeader className="px-7 pt-7 pb-0">
										<CardTitle
											className="text-lg font-bold"
											style={{ color: tier.color }}
										>
											{tier.tier}
										</CardTitle>
										<div className="mt-2 flex items-baseline gap-1">
											<span className="text-4xl font-black text-white">
												{tier.price}€
											</span>
											<span className="text-sm text-[#8BA3B9]/60">
												{tier.period}
											</span>
										</div>
									</CardHeader>

									<CardContent className="px-7 pt-6 pb-7">
										<Separator className="mb-6 bg-white/6" />
										<ul className="space-y-3">
											{tier.perks.map((perk) => (
												<li
													key={perk}
													className="flex items-center gap-3 text-sm text-[#8BA3B9]/80"
												>
													<div
														className="h-1.5 w-1.5 shrink-0 rounded-full"
														style={{
															backgroundColor: `${tier.color}AA`,
														}}
													/>
													{perk}
												</li>
											))}
										</ul>
									</CardContent>
								</Card>
							</ScrollReveal>
						))}
					</div>
				</div>
			</section>

			{/* Final CTA */}
			<section className="relative z-10 py-16 md:py-36">
				{/* Ambient background glow */}
				<div
					className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
					style={{
						width: 700,
						height: 700,
						background:
							"radial-gradient(circle, rgba(0,212,255,0.04) 0%, rgba(255,119,51,0.02) 40%, transparent 70%)",
					}}
					aria-hidden="true"
				/>

				<div className="relative mx-auto max-w-3xl px-6 text-center">
					<ScrollReveal>
						<h2 className="text-4xl font-black tracking-tight text-white md:text-6xl">
							Ready to build your{" "}
							<span
								className="bg-linear-to-r from-[#00D4FF] via-[#FF7733] to-[#FFBB44] bg-clip-text text-transparent"
								style={{
									backgroundSize: "200% auto",
									animation: "gradient-shift 4s ease-in-out infinite",
								}}
							>
								empire
							</span>
							?
						</h2>
						<p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-[#8BA3B9]/80">
							Start from a single generator and build the most efficient assembly line
							the world has ever seen.
						</p>

						<div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
							<Button
								asChild
								size="lg"
								className="h-14 rounded-2xl bg-linear-to-r from-[#00D4FF] to-[#0088BB] px-12 text-base font-bold text-[#0A1A2F] shadow-[0_0_40px_rgba(0,212,255,0.2)] transition-all duration-300 hover:shadow-[0_0_60px_rgba(0,212,255,0.4)] hover:brightness-110"
							>
								<Link href="/play">
									Start Building
									<ArrowRight size={18} />
								</Link>
							</Button>
						</div>

						<p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-[#8BA3B9]/40">
							<Lock size={10} />
							Free to play. No account required to start.
						</p>
					</ScrollReveal>
				</div>
			</section>

			{/* Footer */}
			<footer className="relative z-10 border-t border-white/5 bg-[#06101E]/90">
				<div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 py-6 sm:flex-row sm:justify-between">
					{/* Logo */}
					<div className="flex items-center gap-2.5">
						<Image src="/logo-icon.svg" alt="Assembly Line" width={22} height={22} />
						<span className="text-sm font-bold text-white/70">Assembly Line</span>
					</div>

					{/* Links */}
					<div className="flex items-center gap-4 sm:gap-5">
						<a
							href="#features"
							className="text-xs text-white/30 transition-colors hover:text-white/60 sm:text-sm"
						>
							Features
						</a>
						<a
							href="#pipeline"
							className="text-xs text-white/30 transition-colors hover:text-white/60 sm:text-sm"
						>
							Pipeline
						</a>
						<a
							href="#eras"
							className="text-xs text-white/30 transition-colors hover:text-white/60 sm:text-sm"
						>
							Eras
						</a>
						<a
							href="#support"
							className="text-xs text-white/30 transition-colors hover:text-white/60 sm:text-sm"
						>
							Support
						</a>
					</div>

					{/* Socials + credit */}
					<div className="flex items-center gap-4">
						<p className="flex items-center gap-1.5 text-xs text-white/25">
							Made with <Heart size={10} className="text-[#FF4422]/50" /> by the team
						</p>
						<a
							href="https://github.com/Assembly-Line-Incremental"
							target="_blank"
							rel="noopener noreferrer"
							className="text-white/25 transition-colors hover:text-white/50"
							aria-label="GitHub"
						>
							<Github size={16} />
						</a>
						<a
							href="#"
							className="text-white/25 transition-colors hover:text-white/50"
							aria-label="Discord"
						>
							<MessageCircle size={16} />
						</a>
					</div>
				</div>
			</footer>
		</div>
	);
}
