"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { UserMenu } from "@/features/game/components/user-menu";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();

	return (
		<div className="min-h-screen bg-[#0A1A2F]">
			{/* Background grid */}
			<div
				className="pointer-events-none fixed inset-0 opacity-[0.02]"
				style={{
					backgroundImage:
						"linear-gradient(rgba(0,212,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,1) 1px, transparent 1px)",
					backgroundSize: "60px 60px",
				}}
			/>

			{/* Header */}
			<header className="fixed inset-x-0 top-0 z-50 border-b border-white/6 bg-[#0A1A2F]/92 backdrop-blur-xl">
				<div
					className="pointer-events-none absolute inset-x-0 top-0 h-px"
					style={{
						background:
							"linear-gradient(to right, transparent 5%, #00D4FF20 40%, #FF772320 60%, transparent 95%)",
					}}
					aria-hidden
				/>
				<div className="flex h-17 items-center gap-3 px-4">
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

					<div className="h-6 w-px shrink-0 bg-white/8" />

					<div className="flex flex-1 items-center gap-2 overflow-x-auto py-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
						<button
							type="button"
							onClick={() => router.push("/play")}
							className="flex items-center gap-1.5 text-[13px] text-white/40 transition-colors hover:text-white/70"
						>
							<ArrowLeft size={15} />
							Retour
						</button>
					</div>

					<UserMenu />
				</div>
			</header>

			{/* Page body */}
			<div className="mx-auto max-w-5xl px-4 pt-[calc(4.25rem+2.5rem)] pb-8">{children}</div>
		</div>
	);
}
