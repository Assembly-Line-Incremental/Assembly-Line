"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, Check, Globe, Loader2, Lock, User, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTRPC } from "@/trpc/client";
import { useUploadThing } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { getAvatarColor, getInitials, PRESET_AVATARS } from "@/features/profile/constants";
import { nameSchema } from "@/features/profile/schemas";
import type { NameForm } from "@/features/profile/schemas";
import Image from "next/image";
import { Section } from "@/features/profile/components/section";
import { HeroCard } from "./hero-card";

export function SectionProfil() {
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	const [uploadProgress, setUploadProgress] = useState(0);
	const [isUploading, setIsUploading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const { data: profile } = useQuery(trpc.user.getMe.queryOptions());

	const nameForm = useForm<NameForm>({
		resolver: zodResolver(nameSchema),
		defaultValues: { name: "" },
	});

	const { reset } = nameForm;
	const committedNameRef = useRef<string | undefined>(undefined);
	useEffect(() => {
		if (profile && profile.name !== committedNameRef.current) {
			committedNameRef.current = profile.name;
			reset({ name: profile.name });
		}
	}, [profile, reset]);

	const invalidateProfile = useCallback(
		() => queryClient.invalidateQueries({ queryKey: trpc.user.getMe.queryKey() }),
		[queryClient, trpc]
	);

	const updateProfile = useMutation(
		trpc.user.updateProfile.mutationOptions({
			onSuccess: () => {
				toast.success("Profil mis à jour");
				invalidateProfile();
			},
			onError: (err) => toast.error(err.message),
		})
	);

	const updateAvatar = useMutation(
		trpc.user.updateAvatar.mutationOptions({
			onSuccess: () => {
				toast.success("Avatar mis à jour");
				invalidateProfile();
			},
			onError: (err) => toast.error(err.message),
		})
	);

	const { startUpload } = useUploadThing("avatar", {
		onUploadProgress: (p) => setUploadProgress(p),
		onClientUploadComplete: (res) => {
			setIsUploading(false);
			setUploadProgress(0);
			if (res?.[0]?.url) updateAvatar.mutate({ image: res[0].url });
		},
		onUploadError: () => {
			setIsUploading(false);
			setUploadProgress(0);
			toast.error("Échec de l'upload");
		},
	});

	async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
		const MAX_SIZE = 2 * 1024 * 1024; // 2 MB, matches UploadThing config
		if (!ALLOWED_TYPES.includes(file.type)) {
			toast.error("Format non supporté. Utilisez JPEG, PNG, GIF ou WebP.");
			if (fileInputRef.current) fileInputRef.current.value = "";
			return;
		}
		if (file.size > MAX_SIZE) {
			toast.error("Fichier trop volumineux. Maximum 2 Mo.");
			if (fileInputRef.current) fileInputRef.current.value = "";
			return;
		}
		setIsUploading(true);
		try {
			await startUpload([file]);
		} catch (err) {
			toast.error((err instanceof Error && err.message) || "Upload failed");
			setIsUploading(false);
			setUploadProgress(0);
		} finally {
			if (fileInputRef.current) fileInputRef.current.value = "";
		}
	}

	const image = profile?.image ?? null;
	const name = profile?.name ?? "";
	const color = getAvatarColor(name);
	const initials = getInitials(name);

	return (
		<>
			<HeroCard isUploading={isUploading} uploadProgress={uploadProgress} />

			<Section icon={User} title="Nom d'affichage">
				<form
					onSubmit={nameForm.handleSubmit((data) =>
						updateProfile.mutate({ name: data.name })
					)}
				>
					<div className="flex gap-3">
						<div className="flex-1">
							<input
								{...nameForm.register("name")}
								type="text"
								placeholder="Votre nom"
								className={cn(
									"w-full rounded-xl border bg-white/4 px-4 py-2.5 text-sm text-white placeholder-white/20 transition-colors outline-none",
									nameForm.formState.errors.name
										? "border-red-500/40"
										: "border-white/8 focus:border-white/20"
								)}
							/>
							{nameForm.formState.errors.name && (
								<p className="mt-1.5 text-[11px] text-red-400">
									{nameForm.formState.errors.name.message}
								</p>
							)}
							<p className="mt-1.5 text-[11px] text-white/25">
								Entre 3 et 20 caractères
							</p>
						</div>
						<button
							type="submit"
							disabled={updateProfile.isPending || !nameForm.formState.isDirty}
							className={cn(
								"flex h-10 items-center gap-2 self-start rounded-xl px-4 text-[13px] font-medium transition-colors",
								updateProfile.isPending || !nameForm.formState.isDirty
									? "cursor-not-allowed bg-white/4 text-white/25"
									: "bg-[#00D4FF]/10 text-[#00D4FF] ring-1 ring-[#00D4FF]/20 hover:bg-[#00D4FF]/15"
							)}
						>
							{updateProfile.isPending ? (
								<Loader2 size={13} className="animate-spin" />
							) : (
								<Check size={13} />
							)}
							Enregistrer
						</button>
					</div>
				</form>
			</Section>

			<Section icon={Globe} title="Visibilité du profil">
				<div className="flex flex-col gap-3 sm:flex-row">
					{(["public", "private"] as const).map((v) => {
						const isPublicOpt = v === "public";
						const isActive = profile?.isPublic === isPublicOpt;
						return (
							<button
								key={v}
								type="button"
								disabled={updateProfile.isPending || !profile}
								onClick={() =>
									!isActive && updateProfile.mutate({ isPublic: isPublicOpt })
								}
								className={cn(
									"flex flex-1 items-center gap-3 rounded-xl border p-4 text-left transition-all",
									isActive
										? isPublicOpt
											? "border-emerald-500/30 bg-emerald-500/8"
											: "border-[#00D4FF]/25 bg-[#00D4FF]/6"
										: "border-white/6 bg-white/3 hover:border-white/12"
								)}
							>
								<div
									className={cn(
										"flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
										isActive
											? isPublicOpt
												? "bg-emerald-500/15"
												: "bg-[#00D4FF]/10"
											: "bg-white/5"
									)}
								>
									{isPublicOpt ? (
										<Globe
											size={15}
											className={
												isActive ? "text-emerald-400" : "text-white/30"
											}
										/>
									) : (
										<Lock
											size={15}
											className={
												isActive ? "text-[#00D4FF]" : "text-white/30"
											}
										/>
									)}
								</div>
								<div>
									<p
										className={cn(
											"text-[13px] font-semibold",
											isActive
												? isPublicOpt
													? "text-emerald-300"
													: "text-[#00D4FF]"
												: "text-white/50"
										)}
									>
										{isPublicOpt ? "Public" : "Privé"}
									</p>
									<p className="mt-0.5 text-[11px] text-white/30">
										{isPublicOpt
											? "Visible par tous les joueurs"
											: "Seul vous pouvez voir votre profil"}
									</p>
								</div>
								{isActive && (
									<Check
										size={14}
										className={cn(
											"ml-auto shrink-0",
											isPublicOpt ? "text-emerald-400" : "text-[#00D4FF]"
										)}
									/>
								)}
							</button>
						);
					})}
				</div>
			</Section>

			<Section icon={Camera} title="Avatar">
				<input
					ref={fileInputRef}
					type="file"
					accept="image/jpeg,image/png,image/gif,image/webp"
					className="hidden"
					onChange={handleFileChange}
				/>
				<div className="mb-4 flex items-center gap-4">
					<button
						type="button"
						onClick={() => fileInputRef.current?.click()}
						disabled={isUploading || updateAvatar.isPending}
						className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/4 px-4 py-2.5 text-[13px] text-white/60 transition-colors hover:bg-white/6 hover:text-white/80 disabled:cursor-not-allowed disabled:opacity-40"
					>
						{isUploading ? (
							<Loader2 size={14} className="animate-spin" />
						) : (
							<UploadCloud size={14} />
						)}
						{isUploading ? `Upload… ${uploadProgress}%` : "Uploader une image"}
					</button>
					{image && (
						<button
							type="button"
							onClick={() => updateAvatar.mutate({ image: null })}
							disabled={updateAvatar.isPending}
							className="flex items-center gap-2 rounded-xl border border-white/6 bg-white/3 px-3 py-2.5 text-[13px] text-white/35 transition-colors hover:border-red-500/20 hover:text-red-400/70 disabled:opacity-40"
						>
							<X size={13} />
							Supprimer
						</button>
					)}
				</div>
				<p className="mb-3 text-[11px] font-medium tracking-widest text-white/20 uppercase">
					Avatars prédéfinis
				</p>
				<div className="flex flex-wrap gap-2.5">
					{PRESET_AVATARS.map((url) => (
						<button
							key={url}
							type="button"
							onClick={() => updateAvatar.mutate({ image: url })}
							disabled={updateAvatar.isPending}
							className={cn(
								"relative h-12 w-12 overflow-hidden rounded-xl ring-2 transition-all duration-150 hover:scale-105",
								image === url
									? "ring-[#00D4FF]/50"
									: "ring-white/10 hover:ring-white/25"
							)}
						>
							<Image
								src={url}
								alt="Preset avatar"
								width={48}
								height={48}
								className="h-full w-full object-cover"
							/>
							{image === url && (
								<div className="absolute inset-0 flex items-center justify-center bg-[#00D4FF]/20">
									<Check size={14} className="text-white" />
								</div>
							)}
						</button>
					))}
					<button
						type="button"
						onClick={() => updateAvatar.mutate({ image: null })}
						disabled={updateAvatar.isPending}
						className={cn(
							"flex h-12 w-12 items-center justify-center rounded-xl text-[13px] font-bold ring-2 transition-all duration-150 hover:scale-105",
							!image ? "ring-[#00D4FF]/50" : "ring-white/10 hover:ring-white/25"
						)}
						style={{ backgroundColor: color.bg, color: color.text }}
					>
						{initials || "?"}
					</button>
				</div>
			</Section>
		</>
	);
}
