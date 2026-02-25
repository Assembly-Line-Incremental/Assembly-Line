"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, LogOut, Settings, Trophy, UserRound } from "lucide-react";
import { authClient } from "@/lib/auth/auth-client";
import { useGameSave } from "@/features/game/context/game-save-context";
import type { SaveInfo } from "@/types";
import { cn } from "@/lib/utils";

// ─── Avatar ───────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
	{ bg: "#00D4FF15", text: "#00D4FF", ring: "#00D4FF25" },
	{ bg: "#FF773315", text: "#FF7733", ring: "#FF773325" },
	{ bg: "#FFBB4415", text: "#FFBB44", ring: "#FFBB4425" },
	{ bg: "#A855F715", text: "#A855F7", ring: "#A855F725" },
	{ bg: "#22C55E15", text: "#22C55E", ring: "#22C55E25" },
];

function getAvatarColor(name: string) {
	let h = 0;
	for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
	return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

function getInitials(name: string) {
	return name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((w) => w[0]?.toUpperCase() ?? "")
		.join("");
}

interface AvatarProps {
	name: string;
	size?: "sm" | "lg";
}

function Avatar({ name, size = "sm" }: AvatarProps) {
	const c = getAvatarColor(name);
	return (
		<div
			className={cn(
				"flex shrink-0 items-center justify-center rounded-full font-bold ring-1",
				size === "lg" ? "h-10 w-10 text-sm" : "h-9 w-9 text-[14px]"
			)}
			style={
				{
					backgroundColor: c.bg,
					color: c.text,
					"--tw-ring-color": c.ring,
				} as React.CSSProperties
			}
		>
			{getInitials(name) || "?"}
		</div>
	);
}

// ─── Menu item ────────────────────────────────────────────────────────────────

interface MenuItemProps {
	icon: React.ElementType;
	label: string;
	href?: string;
	onClick?: () => void;
	danger?: boolean;
}

function MenuItem({ icon: Icon, label, href, onClick, danger }: MenuItemProps) {
	const cls = cn(
		"flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors duration-100",
		danger
			? "text-[#FF4422]/70 hover:bg-[#FF4422]/8 hover:text-[#FF4422]"
			: "text-white/55 hover:bg-white/6 hover:text-white/90"
	);
	if (href) {
		return (
			<Link href={href} role="menuitem" className={cls}>
				<Icon size={14} strokeWidth={2} />
				{label}
			</Link>
		);
	}
	return (
		<button
			type="button"
			role="menuitem"
			onClick={onClick}
			className={cn(cls, "cursor-pointer")}
		>
			<Icon size={14} strokeWidth={2} />
			{label}
		</button>
	);
}

// ─── Save slot row ────────────────────────────────────────────────────────────

interface SaveRowProps {
	save: SaveInfo;
	isActive: boolean;
	onSelect: () => void;
}

function SaveRow({ save, isActive, onSelect }: SaveRowProps) {
	return (
		<button
			type="button"
			role="menuitem"
			onClick={onSelect}
			className={cn(
				"flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left transition-colors duration-100",
				isActive ? "bg-white/6" : "hover:bg-white/4"
			)}
		>
			{/* Active indicator dot */}
			<div className="flex h-4 w-4 shrink-0 items-center justify-center">
				<div
					className={cn(
						"rounded-full transition-all duration-200",
						isActive ? "h-2 w-2 bg-[#00D4FF]" : "h-1.5 w-1.5 bg-white/15"
					)}
					style={isActive ? { boxShadow: "0 0 6px #00D4FF80" } : undefined}
				/>
			</div>

			{/* Slot info */}
			<div className="min-w-0 flex-1">
				<p
					className={cn(
						"truncate text-[12px] font-semibold",
						isActive ? "text-white/90" : "text-white/50"
					)}
				>
					{save.name}
				</p>
				<p className="text-[10px] text-white/30">
					Slot {save.slot} · Era {save.currentEra}
				</p>
			</div>

			{/* Prestige badge */}
			{save.prestigeCount > 0 && (
				<span className="shrink-0 rounded-full bg-[#FF773312] px-1.5 py-0.5 text-[9px] font-bold text-[#FF7733]/70">
					×{save.prestigeCount}
				</span>
			)}
		</button>
	);
}

// ─── Main component ───────────────────────────────────────────────────────────

export function UserMenu() {
	const { data: session, isPending } = authClient.useSession();
	const { saveId, saves, switchSave } = useGameSave();
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const router = useRouter();

	// Close on outside click/tap
	useEffect(() => {
		if (!open) return;
		const onPointerDown = (e: PointerEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
		};
		document.addEventListener("pointerdown", onPointerDown);
		return () => document.removeEventListener("pointerdown", onPointerDown);
	}, [open]);

	// Focus first menu item when menu opens
	useEffect(() => {
		if (!open) return;
		const first = menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]');
		first?.focus();
	}, [open]);

	function handleMenuKeyDown(e: React.KeyboardEvent) {
		if (!menuRef.current) return;
		const items = Array.from(
			menuRef.current.querySelectorAll<HTMLElement>('[role="menuitem"]')
		);
		if (!items.length) return;

		const idx = items.indexOf(document.activeElement as HTMLElement);

		if (e.key === "ArrowDown") {
			e.preventDefault();
			items[(idx + 1) % items.length]?.focus();
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			items[(idx - 1 + items.length) % items.length]?.focus();
		} else if (e.key === "Escape") {
			e.preventDefault();
			setOpen(false);
			triggerRef.current?.focus();
		}
	}

	async function handleSignOut() {
		setOpen(false);
		try {
			await authClient.signOut();
			router.push("/login");
		} catch {
			// Sign-out failed — menu is already closed; user can retry via a page reload.
		}
	}

	if (isPending) {
		return <div className="h-9 w-9 animate-pulse rounded-full bg-white/8" />;
	}
	if (!session) return null;

	const { name, email } = session.user;

	return (
		<div ref={ref} className="relative">
			{/* Trigger */}
			<button
				ref={triggerRef}
				type="button"
				aria-label="User menu"
				aria-expanded={open}
				aria-haspopup="menu"
				onClick={() => setOpen((v) => !v)}
				className="group flex items-center gap-2 rounded-xl p-1 pr-2 transition-colors duration-150 hover:bg-white/6"
			>
				<Avatar name={name} size="sm" />
				<ChevronDown
					size={15}
					strokeWidth={2.5}
					className={cn(
						"text-white/30 transition-transform duration-200",
						open && "rotate-180"
					)}
				/>
			</button>

			{/* Dropdown */}
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
						className="absolute top-[calc(100%+8px)] right-0 z-50 w-64 origin-top-right overflow-hidden rounded-2xl border border-white/8 bg-[#0D2035]/95 shadow-[0_16px_48px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl"
					>
						{/* ── User info ── */}
						<div className="flex items-center gap-3 px-4 py-4">
							<Avatar name={name} size="lg" />
							<div className="min-w-0 flex-1">
								<p className="truncate text-[13px] font-semibold text-white/90">
									{name}
								</p>
								<p className="truncate text-[11px] text-white/35">{email}</p>
							</div>
						</div>

						<div className="mx-3 h-px bg-white/6" />

						{/* ── Save slots ── */}
						{saves.length > 0 && (
							<>
								<div className="px-2 pt-2.5 pb-1">
									<p className="mb-1 px-3 text-[9px] font-semibold tracking-[0.12em] text-white/25 uppercase">
										Save Slots
									</p>
									{saves.map((s) => (
										<SaveRow
											key={s.id}
											save={s}
											isActive={s.id === saveId}
											onSelect={() => {
												switchSave(s.id);
												setOpen(false);
											}}
										/>
									))}
								</div>
								<div className="mx-3 h-px bg-white/6" />
							</>
						)}

						{/* ── Nav items ── */}
						<div className="p-2">
							<MenuItem icon={UserRound} label="Profile" href="/profile" />
							<MenuItem icon={Trophy} label="Leaderboard" href="/leaderboard" />
							<MenuItem icon={Settings} label="Settings" href="/play/settings" />
						</div>

						<div className="mx-3 h-px bg-white/6" />

						{/* ── Sign out ── */}
						<div className="p-2">
							<MenuItem
								icon={LogOut}
								label="Sign out"
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
