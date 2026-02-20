"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const NAV_LINKS = [
	{ label: "Features", href: "#features" },
	{ label: "Pipeline", href: "#pipeline" },
	{ label: "Eras", href: "#eras" },
	{ label: "Support", href: "#support" },
] as const;

export function Navbar() {
	const [scrolled, setScrolled] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 40);
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<nav className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
			<div
				className={`flex w-full max-w-3xl items-center justify-between rounded-full border px-4 py-2 transition-all duration-500 sm:px-6 sm:py-2.5 ${
					scrolled
						? "border-[#00D4FF]/15 bg-[#0A1A2F]/85 shadow-[0_4px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl"
						: "border-white/6 bg-[#0A1A2F]/40 backdrop-blur-md"
				}`}
			>
				{/* Logo */}
				<Link href="/" className="flex items-center gap-2">
					<Image
						src="/logo-icon.svg"
						alt="Assembly Line"
						width={26}
						height={26}
						className="h-[26px] w-[26px]"
					/>
					<span className="text-[15px] font-bold tracking-tight text-white/90">
						Assembly Line
					</span>
				</Link>

				{/* Desktop links */}
				<div className="hidden items-center gap-0.5 md:flex">
					{NAV_LINKS.map((link) => (
						<a
							key={link.href}
							href={link.href}
							className="group relative rounded-full px-3.5 py-1.5 text-sm text-white/45 transition-colors hover:text-white/90"
						>
							{link.label}
							<span className="absolute bottom-0 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-[#00D4FF] opacity-0 transition-all group-hover:opacity-80" />
						</a>
					))}
				</div>

				{/* Desktop CTA */}
				<div className="hidden md:block">
					<Button
						asChild
						size="sm"
						className="h-9 rounded-full bg-linear-to-r from-[#00D4FF] to-[#0088BB] px-5! text-sm font-bold text-[#042a3e] transition-opacity hover:opacity-85"
					>
						<Link href="/play">
							Play Now
							<ArrowRight size={12} />
						</Link>
					</Button>
				</div>

				{/* Mobile toggle */}
				<button
					type="button"
					className="flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/5 hover:text-white md:hidden"
					onClick={() => setMobileOpen(!mobileOpen)}
					aria-label="Toggle menu"
				>
					{mobileOpen ? <X size={18} /> : <Menu size={18} />}
				</button>
			</div>

			{/* Mobile menu */}
			<div
				className={`absolute top-full right-0 left-0 mt-2 overflow-hidden px-4 transition-all duration-300 md:hidden ${
					mobileOpen ? "max-h-80 opacity-100" : "pointer-events-none max-h-0 opacity-0"
				}`}
			>
				<div className="rounded-2xl border border-white/6 bg-[#0A1A2F]/95 p-4 backdrop-blur-xl">
					<div className="flex flex-col gap-1">
						{NAV_LINKS.map((link) => (
							<a
								key={link.href}
								href={link.href}
								onClick={() => setMobileOpen(false)}
								className="rounded-xl px-3 py-2.5 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
							>
								{link.label}
							</a>
						))}
						<Separator className="mt-2 bg-white/5" />
						<div className="pt-3">
							<Button
								asChild
								size="sm"
								className="w-full rounded-xl bg-linear-to-r from-[#00D4FF] to-[#0088BB] font-semibold text-[#0A1A2F]"
							>
								<Link href="/play" onClick={() => setMobileOpen(false)}>
									Play Now
									<ArrowRight size={14} />
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
}
