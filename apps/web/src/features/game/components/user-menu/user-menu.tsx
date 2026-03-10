"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, LogOut, Plus, Settings, Trophy, UserRound } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth/auth-client";
import { useTRPC } from "@/trpc/client";
import { useGameSave } from "@/features/game/context/game-save-context";
import { cn } from "@/lib/utils";
import { Avatar } from "./avatar";
import { MenuItem } from "./menu-item";
import { SaveRow } from "./save-row";

export function UserMenu() {
	const { data: session, isPending } = authClient.useSession();
	const { saveId, saves, maxSaves, switchSave } = useGameSave();
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const router = useRouter();
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	const { data: profile } = useQuery({ ...trpc.user.getMe.queryOptions(), enabled: !!session });
	const savesQueryKey = trpc.game.saves.queryOptions().queryKey;

	const createSave = useMutation(
		trpc.game.createSave.mutationOptions({
			onSuccess: ({ id }) => {
				queryClient.invalidateQueries({ queryKey: savesQueryKey });
				switchSave(id);
			},
			onError: (err) => console.error("Failed to create save:", err),
		})
	);

	const deleteSave = useMutation(
		trpc.game.deleteSave.mutationOptions({
			onSuccess: (_data, variables) => {
				queryClient.invalidateQueries({ queryKey: savesQueryKey });
				// If we deleted the active save, switch to another one
				if (variables.saveId === saveId) {
					const remaining = saves.filter((s) => s.id !== variables.saveId);
					if (remaining.length > 0) switchSave(remaining[0].id);
				}
			},
			onError: (err) => console.error("Failed to delete save:", err),
		})
	);

	const renameSave = useMutation(
		trpc.game.renameSave.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: savesQueryKey });
			},
			onError: (err) => console.error("Failed to rename save:", err),
		})
	);

	// Close on outside click/tap
	useEffect(() => {
		if (!open) return;
		const onPointerDown = (e: PointerEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
		};
		document.addEventListener("pointerdown", onPointerDown);
		return () => document.removeEventListener("pointerdown", onPointerDown);
	}, [open]);

	// Focus first enabled menu item when menu opens
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
			const target = idx === -1 ? items.length - 1 : (idx - 1 + items.length) % items.length;
			items[target]?.focus();
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

	const name = profile?.name ?? session.user.name;
	const email = profile?.email ?? session.user.email;
	const image = profile?.image ?? session.user.image ?? null;
	const canAddSave = saves.length < maxSaves;

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
							<Avatar name={name} image={image} size="lg" />
							<div className="min-w-0 flex-1">
								<p className="truncate text-[13px] font-semibold text-white/90">
									{name}
								</p>
								<p className="truncate text-[11px] text-white/35">{email}</p>
							</div>
						</div>

						<div className="mx-3 h-px bg-white/6" />

						{/* ── Save slots ── */}
						<div className="px-2 pt-2.5 pb-1">
							<div className="mb-1 flex items-center px-3">
								<p className="flex-1 text-[9px] font-semibold tracking-[0.12em] text-white/25 uppercase">
									Save Slots{" "}
									<span className="text-white/15">
										{saves.length}/{maxSaves}
									</span>
								</p>
							</div>

							<div className="flex flex-col gap-y-1">
								{saves.map((s) => (
									<SaveRow
										key={s.id}
										save={s}
										isActive={s.id === saveId}
										canDelete={
											saves.length > 1 &&
											s.id !== saveId &&
											!deleteSave.isPending
										}
										onSelect={() => {
											switchSave(s.id);
											setOpen(false);
										}}
										onRename={(name) => {
											if (!renameSave.isPending)
												renameSave.mutate({ saveId: s.id, name });
										}}
										onDelete={() => {
											if (!deleteSave.isPending)
												deleteSave.mutate({ saveId: s.id });
										}}
									/>
								))}
							</div>

							{/* Add save button */}
							<button
								type="button"
								role="menuitem"
								disabled={!canAddSave || createSave.isPending}
								onClick={() => canAddSave && createSave.mutate()}
								className={cn(
									"mt-0.5 flex w-full items-center gap-2.5 rounded-lg px-3 py-1.5 text-left transition-colors duration-100",
									canAddSave && !createSave.isPending
										? "text-white/35 hover:bg-white/4 hover:text-white/55"
										: "cursor-not-allowed text-white/20 opacity-35"
								)}
							>
								<div className="flex h-4 w-4 shrink-0 items-center justify-center">
									<Plus size={11} strokeWidth={2.5} />
								</div>
								<span className="text-[12px] font-medium">
									{createSave.isPending
										? "Création..."
										: canAddSave
											? "Nouvelle sauvegarde"
											: `Maximum atteint (${maxSaves})`}
								</span>
							</button>
						</div>

						<div className="mx-3 h-px bg-white/6" />

						{/* ── Nav items ── */}
						<div className="flex flex-col gap-y-0.5 p-2">
							<MenuItem icon={UserRound} label="Mon profil" href="/profile" />
							<MenuItem icon={Trophy} label="Leaderboard" href="/leaderboard" />
							<MenuItem icon={Settings} label="Settings" href="/profile/settings" />
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
