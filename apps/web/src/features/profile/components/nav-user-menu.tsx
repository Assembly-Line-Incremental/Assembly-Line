"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, LogOut, Settings, Trophy, UserRound } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { authClient } from "@/lib/auth/auth-client";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Avatar } from "@/features/game/components/user-menu/avatar";
import { MenuItem } from "@/features/game/components/user-menu/menu-item";

/**
 * Lightweight user menu for pages outside the game context (no save slots).
 * Shows a login/register button when unauthenticated.
 */
export function NavUserMenu() {
	const { data: session, isPending } = authClient.useSession();
	const trpc = useTRPC();
	const { data: profile } = useQuery({
		...trpc.user.getMe.queryOptions(),
		enabled: !!session,
	});
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const router = useRouter();

	// Close on outside click
	useEffect(() => {
		if (!open) return;
		const onPointerDown = (e: PointerEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
		};
		document.addEventListener("pointerdown", onPointerDown);
		return () => document.removeEventListener("pointerdown", onPointerDown);
	}, [open]);

	// Focus first menu item on open
	useEffect(() => {
		if (!open) return;
		const first = Array.from(
			menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []
		).find((el) => el.getAttribute("aria-disabled") !== "true" && !el.hasAttribute("disabled"));
		first?.focus();
	}, [open]);

	function handleMenuKeyDown(e: React.KeyboardEvent) {
		if (!menuRef.current) return;
		const items = Array.from(
			menuRef.current.querySelectorAll<HTMLElement>('[role="menuitem"]')
		).filter(
			(el) => el.getAttribute("aria-disabled") !== "true" && !el.hasAttribute("disabled")
		);
		if (!items.length) return;
		const idx = items.indexOf(document.activeElement as HTMLElement);
		if (e.key === "ArrowDown") {
			e.preventDefault();
			items[(idx + 1) % items.length]?.focus();
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			items[idx === -1 ? items.length - 1 : (idx - 1 + items.length) % items.length]?.focus();
		} else if (e.key === "Escape") {
			e.preventDefault();
			setOpen(false);
			triggerRef.current?.focus();
		}
	}

	async function handleSignOut() {
		try {
			await authClient.signOut();
			setOpen(false);
			router.push("/login");
		} catch {
			toast.error("Impossible de se déconnecter. Veuillez réessayer.");
		}
	}

	if (isPending) {
		return <div className="h-9 w-24 animate-pulse rounded-xl bg-white/8" />;
	}

	// ── Not logged in ──
	if (!session) {
		return (
			<div className="flex items-center gap-2">
				<Link
					href="/login"
					className="rounded-xl px-3 py-1.5 text-[13px] text-white/50 transition-colors hover:text-white/80"
				>
					Connexion
				</Link>
				<Link
					href="/register"
					className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-[13px] text-white/70 transition-colors hover:bg-white/8 hover:text-white/90"
				>
					S&apos;inscrire
				</Link>
			</div>
		);
	}

	const name = profile?.name ?? session.user.name;
	const image = profile?.image ?? null;
	const email = profile?.email ?? session.user.email;

	return (
		<div ref={ref} className="relative">
			<button
				ref={triggerRef}
				type="button"
				aria-label="User menu"
				aria-expanded={open}
				aria-haspopup="menu"
				onClick={() => setOpen((v) => !v)}
				className="group flex items-center gap-2 rounded-xl p-1 pr-2 transition-colors duration-150 hover:bg-white/6"
			>
				<Avatar name={name} image={image} size="sm" />
				<ChevronDown
					size={15}
					strokeWidth={2.5}
					className={cn(
						"text-white/30 transition-transform duration-200",
						open && "rotate-180"
					)}
				/>
			</button>

			<AnimatePresence>
				{open && (
					<motion.div
						ref={menuRef}
						role="menu"
						aria-label="User menu"
						onKeyDown={handleMenuKeyDown}
						initial={{ opacity: 0, scale: 0.95, y: -6 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: -6 }}
						transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
						className="absolute top-[calc(100%+8px)] right-0 z-50 w-56 origin-top-right overflow-hidden rounded-2xl border border-white/8 bg-[#0D2035]/95 shadow-[0_16px_48px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl"
					>
						{/* User info */}
						<div className="flex items-center gap-3 px-4 py-4">
							<Avatar name={name} image={image} size="lg" />
							<div className="min-w-0 flex-1">
								<p className="truncate text-[13px] font-semibold text-white/90">
									{name}
								</p>
								<p className="truncate text-[11px] text-white/35">{email}</p>
							</div>
						</div>

						<div className="mx-3 h-px bg-white/6" />

						<div className="flex flex-col gap-y-0.5 p-2">
							<MenuItem
								icon={UserRound}
								label="Mon profil"
								href={`/user/${encodeURIComponent(name)}`}
							/>
							<MenuItem icon={Trophy} label="Leaderboard" href="/leaderboard" />
							<MenuItem icon={Settings} label="Paramètres" href="/profile/settings" />
						</div>

						<div className="mx-3 h-px bg-white/6" />

						<div className="p-2">
							<MenuItem
								icon={LogOut}
								label="Se déconnecter"
								onClick={handleSignOut}
								danger
							/>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
