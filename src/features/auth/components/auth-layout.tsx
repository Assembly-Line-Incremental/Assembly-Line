"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { usePathname } from "next/navigation";
import { ParticleField } from "@/features/landing/components/particle-field";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
	const pathname = usePathname();
	const isLogin = pathname === "/login";

	return (
		<div className="bg-game-bg relative flex min-h-svh items-center justify-center overflow-hidden">
			{/* Canvas particle field — same as hero */}
			<ParticleField />

			{/* Subtle decorative grid */}
			<div
				className="pointer-events-none absolute inset-0 opacity-[0.015]"
				style={{
					backgroundImage:
						"linear-gradient(rgba(0,212,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,1) 1px, transparent 1px)",
					backgroundSize: "60px 60px",
				}}
				aria-hidden="true"
			/>

			{/* Radial glow — center, same as hero */}
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

			{/* Secondary warm glow — lower */}
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
				className="relative z-10 flex w-full flex-col gap-8 px-6 py-12"
				style={{ animation: "fade-in-up 0.8s ease-out both" }}
			>
				{/* Header with logo */}
				<div className="flex flex-col items-center gap-6">
					<Link
						href="/"
						className="group flex items-center gap-2.5 transition-opacity hover:opacity-80"
					>
						<Image
							src="/logo-icon.svg"
							alt="Assembly Line"
							width={36}
							height={36}
							priority
						/>
						<span className="text-lg font-bold tracking-tight text-white/90">
							Assembly Line
						</span>
					</Link>

					<div className="text-center">
						<h1 className="text-2xl font-black tracking-tight text-white">
							{isLogin ? "Welcome back" : "Join the factory"}
						</h1>
						<p className="text-game-text-muted/60 mt-2 text-sm">
							{isLogin
								? "Sign in to continue building your empire"
								: "Create your account and start building"}
						</p>
					</div>
				</div>

				{/* Form content */}
				{children}

				{/* Back to home link */}
				<div className="flex justify-center">
					<Link
						href="/"
						className="group text-game-text-muted/40 hover:text-game-cyan/60 flex items-center gap-1.5 text-xs transition-colors"
					>
						<ArrowLeft
							size={12}
							className="transition-transform group-hover:-translate-x-0.5"
						/>
						Back to home
					</Link>
				</div>
			</div>
		</div>
	);
};

export default AuthLayout;
