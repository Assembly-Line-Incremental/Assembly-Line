"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import type { SaveInfo } from "@/types";
import { cn } from "@/lib/utils";
import { RenameInput } from "./rename-input";

export interface SaveRowProps {
	save: SaveInfo;
	isActive: boolean;
	onSelect: () => void;
	onRename: (name: string) => void;
	onDelete: () => void;
	canDelete: boolean;
}

export function SaveRow({ save, isActive, onSelect, onRename, onDelete, canDelete }: SaveRowProps) {
	const [renaming, setRenaming] = useState(false);
	const [actionsOpen, setActionsOpen] = useState(false);
	const actionsRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);

	// Close actions popover on outside click (ignore clicks on the trigger itself)
	useEffect(() => {
		if (!actionsOpen) return;
		const handler = (e: PointerEvent) => {
			if (
				actionsRef.current &&
				!actionsRef.current.contains(e.target as Node) &&
				triggerRef.current &&
				!triggerRef.current.contains(e.target as Node)
			) {
				setActionsOpen(false);
			}
		};
		document.addEventListener("pointerdown", handler);
		return () => document.removeEventListener("pointerdown", handler);
	}, [actionsOpen]);

	return (
		<div className="group relative">
			<div
				role="menuitem"
				tabIndex={0}
				onClick={() => {
					if (!renaming) onSelect();
				}}
				onKeyDown={(e) => {
					if (
						(e.key === "Enter" || e.key === " ") &&
						!renaming &&
						e.target === e.currentTarget
					) {
						if (e.key === " ") e.preventDefault();
						onSelect();
					}
				}}
				className={cn(
					"flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-1.5 text-left transition-colors duration-100 select-none",
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
					{renaming ? (
						<RenameInput
							initialName={save.name}
							onCommit={(name) => {
								onRename(name);
								setRenaming(false);
							}}
							onCancel={() => setRenaming(false)}
						/>
					) : (
						<p
							className={cn(
								"truncate text-[12px] font-semibold",
								isActive ? "text-white/90" : "text-white/50"
							)}
						>
							{save.name}
						</p>
					)}
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

				{/* Actions trigger */}
				<button
					ref={triggerRef}
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						setActionsOpen((v) => !v);
					}}
					className="ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded text-white/20 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white/8 hover:text-white/60 focus-visible:opacity-100 focus-visible:ring-1 focus-visible:ring-[#00D4FF]/60 focus-visible:outline-none"
					aria-label="Save options"
				>
					<MoreHorizontal size={12} />
				</button>
			</div>

			{/* Actions popover */}
			<AnimatePresence>
				{actionsOpen && (
					<motion.div
						ref={actionsRef}
						initial={{ opacity: 0, scale: 0.92, y: -4 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.92, y: -4 }}
						transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
						className="absolute top-1 right-8 z-10 min-w-30 overflow-hidden rounded-xl border border-white/8 bg-[#0D2035]/95 py-1 shadow-[0_8px_24px_rgba(0,0,0,0.5)] backdrop-blur-xl"
					>
						<button
							type="button"
							onClick={() => {
								setActionsOpen(false);
								setRenaming(true);
							}}
							className="flex w-full items-center gap-2 px-3 py-1.5 text-[12px] text-white/55 transition-colors hover:bg-white/6 hover:text-white/90"
						>
							<Pencil size={11} strokeWidth={2} />
							Renommer
						</button>
						<button
							type="button"
							onClick={() => {
								setActionsOpen(false);
								if (canDelete) onDelete();
							}}
							disabled={!canDelete}
							className={cn(
								"flex w-full items-center gap-2 px-3 py-1.5 text-[12px] transition-colors",
								canDelete
									? "text-[#FF4422]/70 hover:bg-[#FF4422]/8 hover:text-[#FF4422]"
									: "cursor-not-allowed text-white/30 opacity-35"
							)}
						>
							<Trash2 size={11} strokeWidth={2} />
							Supprimer
						</button>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
