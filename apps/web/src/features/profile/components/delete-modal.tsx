"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Eye, EyeOff, Loader2, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function DeleteModal({
	onClose,
	onConfirm,
	isPending,
}: {
	onClose: () => void;
	onConfirm: (password: string) => void;
	isPending: boolean;
}) {
	const [step, setStep] = useState<1 | 2 | 3>(1);
	const [deleteText, setDeleteText] = useState("");
	const [password, setPassword] = useState("");
	const [showPw, setShowPw] = useState(false);

	const canAdvance2 = deleteText === "DELETE";
	const canConfirm = canAdvance2 && password.length > 0;
	const previousFocusRef = useRef<Element | null>(null);

	useEffect(() => {
		previousFocusRef.current = document.activeElement;
		return () => {
			(previousFocusRef.current as HTMLElement | null)?.focus();
		};
	}, []);

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && !isPending) onClose();
		};
		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [onClose, isPending]);

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 z-50 flex items-center justify-center p-4"
			onClick={onClose}
		>
			{/* Backdrop */}
			<div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

			<motion.div
				initial={{ scale: 0.92, opacity: 0, y: 16 }}
				animate={{ scale: 1, opacity: 1, y: 0 }}
				exit={{ scale: 0.92, opacity: 0, y: 16 }}
				transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
				className="relative w-full max-w-md overflow-hidden rounded-2xl border border-red-500/20 bg-[#0D2035] shadow-[0_32px_64px_rgba(0,0,0,0.8)]"
				role="dialog"
				aria-modal="true"
				aria-labelledby="delete-modal-title"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className="flex items-start gap-4 border-b border-white/6 p-6">
					<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10 ring-1 ring-red-500/20">
						<Trash2 size={20} className="text-red-400" />
					</div>
					<div className="flex-1">
						<h2 id="delete-modal-title" className="text-base font-semibold text-white">
							Supprimer mon compte
						</h2>
						<p className="mt-0.5 text-[13px] text-white/45">
							Cette action est irréversible et supprimera toutes vos données.
						</p>
					</div>
					<button
						type="button"
						aria-label="Fermer"
						onClick={onClose}
						disabled={isPending}
						className="rounded-lg p-1.5 text-white/30 transition-colors hover:bg-white/6 hover:text-white/60"
					>
						<X size={16} />
					</button>
				</div>

				{/* Steps indicator */}
				<div className="flex gap-1.5 px-6 pt-5">
					{[1, 2, 3].map((s) => (
						<div
							key={s}
							className={cn(
								"h-1 flex-1 rounded-full transition-colors duration-300",
								step >= s ? "bg-red-500" : "bg-white/8"
							)}
						/>
					))}
				</div>

				<div className="p-6 pt-5">
					{step === 1 && (
						<div className="space-y-4">
							<p className="text-[13px] leading-relaxed text-white/55">
								Vous êtes sur le point de supprimer définitivement votre compte.
								Toutes vos sauvegardes, succès et données seront perdus.
							</p>
							<div className="rounded-xl border border-red-500/15 bg-red-500/5 p-4">
								<ul className="space-y-1.5 text-[12px] text-white/40">
									{[
										"Toutes vos sauvegardes de jeu",
										"Vos succès et statistiques",
										"Votre classement",
										"Votre compte supporter",
									].map((item) => (
										<li key={item} className="flex items-center gap-2">
											<X size={11} className="shrink-0 text-red-400/70" />
											{item}
										</li>
									))}
								</ul>
							</div>
							<button
								type="button"
								onClick={() => setStep(2)}
								className="w-full rounded-xl bg-red-500/10 px-4 py-2.5 text-[13px] font-medium text-red-400 ring-1 ring-red-500/20 transition-colors hover:bg-red-500/15"
							>
								Je comprends, continuer
							</button>
						</div>
					)}

					{step === 2 && (
						<div className="space-y-4">
							<div>
								<p className="mb-3 text-[13px] text-white/55">
									Tapez{" "}
									<span className="font-mono font-semibold text-red-400">
										DELETE
									</span>{" "}
									pour confirmer
								</p>
								<input
									type="text"
									value={deleteText}
									onChange={(e) => setDeleteText(e.target.value)}
									id="confirm-delete"
									aria-label="Tapez DELETE pour confirmer"
									placeholder="DELETE"
									autoFocus
									className={cn(
										"w-full rounded-xl border bg-white/4 px-4 py-2.5 font-mono text-sm text-white placeholder-white/20 transition-colors outline-none",
										canAdvance2
											? "border-red-500/40 focus:border-red-500/60"
											: "border-white/8 focus:border-white/20"
									)}
								/>
							</div>
							<button
								type="button"
								disabled={!canAdvance2}
								onClick={() => setStep(3)}
								className={cn(
									"w-full rounded-xl px-4 py-2.5 text-[13px] font-medium ring-1 transition-colors",
									canAdvance2
										? "bg-red-500/10 text-red-400 ring-red-500/20 hover:bg-red-500/15"
										: "cursor-not-allowed bg-white/3 text-white/20 ring-white/5"
								)}
							>
								Continuer
							</button>
						</div>
					)}

					{step === 3 && (
						<div className="space-y-4">
							<div>
								<p className="mb-3 text-[13px] text-white/55">
									Confirmez votre mot de passe pour finaliser la suppression
								</p>
								<div className="relative">
									<input
										type={showPw ? "text" : "password"}
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										aria-label="Mot de passe de confirmation"
										placeholder="Mot de passe"
										autoFocus
										className="w-full rounded-xl border border-white/8 bg-white/4 px-4 py-2.5 pr-10 text-sm text-white placeholder-white/20 transition-colors outline-none focus:border-white/20"
									/>
									<button
										type="button"
										aria-label={
											showPw
												? "Masquer le mot de passe"
												: "Afficher le mot de passe"
										}
										onClick={() => setShowPw((v) => !v)}
										className="absolute top-1/2 right-3 -translate-y-1/2 text-white/25 transition-colors hover:text-white/50"
									>
										{showPw ? <EyeOff size={15} /> : <Eye size={15} />}
									</button>
								</div>
							</div>
							<button
								type="button"
								disabled={!canConfirm || isPending}
								onClick={() => canConfirm && onConfirm(password)}
								className={cn(
									"flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-medium ring-1 transition-colors",
									canConfirm && !isPending
										? "bg-red-500/15 text-red-400 ring-red-500/25 hover:bg-red-500/20"
										: "cursor-not-allowed bg-white/3 text-white/20 ring-white/5"
								)}
							>
								{isPending ? (
									<>
										<Loader2 size={14} className="animate-spin" />
										Suppression…
									</>
								) : (
									<>
										<Trash2 size={14} />
										Supprimer mon compte
									</>
								)}
							</button>
						</div>
					)}
				</div>
			</motion.div>
		</motion.div>
	);
}
