"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ChevronRight, Download, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence } from "motion/react";
import { authClient } from "@/lib/auth/auth-client";
import { useTRPC } from "@/trpc/client";
import { DeleteModal } from "@/features/profile/components/delete-modal";
import { HeroCard } from "./hero-card";

export function SectionDanger() {
	const trpc = useTRPC();
	const router = useRouter();
	const queryClient = useQueryClient();
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [exportEnabled, setExportEnabled] = useState(false);

	const exportData = useQuery({
		...trpc.user.exportData.queryOptions(),
		enabled: exportEnabled,
	});

	function triggerDownload(data: unknown) {
		const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "mes-donnees-assembly-line.json";
		a.click();
		URL.revokeObjectURL(url);
		// Clear sensitive data from cache after download
		setExportEnabled(false);
		queryClient.removeQueries({ queryKey: trpc.user.exportData.queryOptions().queryKey });
	}

	function handleExport() {
		if (exportData.data) {
			triggerDownload(exportData.data);
		} else {
			setExportEnabled(true);
			exportData
				.refetch()
				.then(({ data }) => {
					if (!data) return;
					triggerDownload(data);
				})
				.catch(() => toast.error("Impossible d'exporter vos données"));
		}
	}

	const deleteAccount = useMutation(
		trpc.user.deleteAccount.mutationOptions({
			onSuccess: async () => {
				setShowDeleteModal(false);
				try {
					await authClient.signOut();
				} catch {
					toast.error("Déconnexion échouée, mais votre compte a bien été supprimé.");
				} finally {
					router.push("/");
				}
			},
			onError: (err) => toast.error(err.message),
		})
	);

	return (
		<>
			<HeroCard />

			<div className="overflow-hidden rounded-2xl border border-white/8 bg-white/2">
				<div className="flex items-center gap-3 border-b border-white/6 px-5 py-4">
					<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/6">
						<Download size={14} className="text-white/50" />
					</div>
					<h2 className="text-[13px] font-semibold tracking-wide text-white/50">
						Mes données (RGPD)
					</h2>
				</div>
				<div className="flex items-center justify-between gap-4 p-5">
					<div>
						<p className="text-[13px] font-medium text-white/60">
							Exporter mes données
						</p>
						<p className="mt-0.5 text-[12px] text-white/30">
							Téléchargez toutes vos données personnelles au format JSON
						</p>
					</div>
					<button
						type="button"
						onClick={handleExport}
						disabled={exportData.isFetching}
						className="flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-[13px] font-medium text-white/60 transition-colors hover:bg-white/8 disabled:opacity-40"
					>
						{exportData.isFetching ? (
							<Loader2 size={13} className="animate-spin" />
						) : (
							<Download size={13} />
						)}
						<span className="hidden sm:inline">Exporter</span>
					</button>
				</div>
			</div>

			<div className="overflow-hidden rounded-2xl border border-red-500/15 bg-red-500/3">
				<div className="flex items-center gap-3 border-b border-red-500/10 px-5 py-4">
					<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10">
						<AlertTriangle size={14} className="text-red-400/80" />
					</div>
					<h2 className="text-[13px] font-semibold tracking-wide text-red-400/70">
						Zone de danger
					</h2>
				</div>
				<div className="flex items-center justify-between gap-4 p-5">
					<div>
						<p className="text-[13px] font-medium text-white/60">
							Supprimer mon compte
						</p>
						<p className="mt-0.5 text-[12px] text-white/30">
							Suppression définitive de toutes vos données
						</p>
					</div>
					<button
						type="button"
						onClick={() => setShowDeleteModal(true)}
						className="flex shrink-0 items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-2 text-[13px] font-medium text-red-400 transition-colors hover:bg-red-500/12"
					>
						<Trash2 size={13} />
						<span className="hidden sm:inline">Supprimer mon compte</span>
						<span className="sm:hidden">Supprimer</span>
						<ChevronRight size={13} className="text-red-400/40" />
					</button>
				</div>
			</div>

			<AnimatePresence>
				{showDeleteModal && (
					<DeleteModal
						onClose={() => setShowDeleteModal(false)}
						onConfirm={(password) => deleteAccount.mutate({ password })}
						isPending={deleteAccount.isPending}
					/>
				)}
			</AnimatePresence>
		</>
	);
}
