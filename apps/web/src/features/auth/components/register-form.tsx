"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth/auth-client";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Loader2, Mail, Lock, User, XCircle } from "lucide-react";
import type { OAuthProvider } from "@/lib/auth/oauth-providers";
import { oauthConfig } from "@/lib/auth/oauth-providers";

const registerSchema = z
	.object({
		username: z
			.string()
			.min(3, "Username must be at least 3 characters long")
			.max(20, "Username must be at most 20 characters long")
			.regex(
				/^[a-zA-Z0-9_-]+$/,
				"Username can only contain letters, numbers, underscores, and hyphens"
			),
		email: z.email("Please provide a valid email address"),
		password: z.string().min(8, "Password must be at least 8 characters long"),
		confirmPassword: z.string().min(8, "Password must be at least 8 characters long"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterForm = ({ enabledProviders }: { enabledProviders: OAuthProvider[] }) => {
	const router = useRouter();
	const trpc = useTRPC();
	const form = useForm({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	// ── Debounced username availability check ──
	const username = form.watch("username");
	const [debouncedUsername, setDebouncedUsername] = useState("");

	useEffect(() => {
		const timeout = setTimeout(() => setDebouncedUsername(username), 500);
		return () => clearTimeout(timeout);
	}, [username]);

	const normalizedUsername = debouncedUsername.toLowerCase();
	const isValidFormat =
		normalizedUsername.length >= 3 && /^[a-zA-Z0-9_-]+$/.test(normalizedUsername);

	const { data: nameCheck, isFetching: isCheckingName } = useQuery({
		...trpc.user.checkNameAvailable.queryOptions({ name: normalizedUsername }),
		enabled: isValidFormat,
		staleTime: 10_000,
	});

	// Stable suggestions — generated once when the name is found taken, not on every render
	const [suggestions, setSuggestions] = useState<string[]>([]);
	useEffect(() => {
		if (isValidFormat && nameCheck?.available === false) {
			setSuggestions([
				`${normalizedUsername.slice(0, 15)}${Math.floor(Math.random() * 99) + 1}`,
				`${normalizedUsername.slice(0, 14)}_${Math.floor(Math.random() * 99) + 1}`,
			]);
		} else {
			setSuggestions([]);
		}
		// intentionally excludes Math.random from deps to keep suggestions stable
	}, [isValidFormat, nameCheck?.available, normalizedUsername]);

	const onSubmit = async (data: RegisterFormValues) => {
		await authClient.signUp.email(
			{
				name: data.username.toLowerCase(),
				email: data.email,
				password: data.password,
			},
			{
				onSuccess: () => {
					router.push("/");
				},
				onError: (error) => {
					// Surface name conflict as a field error
					if (error.error.message?.toLowerCase().includes("name")) {
						form.setError("username", {
							message: "Ce pseudo est déjà pris.",
						});
					} else {
						toast.error(error.error.message);
					}
				},
			}
		);
	};

	const isPending = form.formState.isSubmitting;

	const inputClasses =
		"h-11 rounded-xl border-white/10 bg-game-bg-deep pl-10 text-sm text-white placeholder:text-white/20 focus-visible:border-game-cyan/40 focus-visible:ring-game-cyan/10";

	return (
		<div className="flex flex-col gap-5">
			{/* OAuth buttons */}
			{enabledProviders.length > 0 && (
				<>
					<div className="grid grid-cols-2 gap-3">
						{enabledProviders.map((provider) => (
							<Button
								key={provider}
								variant="outline"
								className="bg-game-bg-deep hover:border-game-cyan/25 hover:bg-game-bg-deep h-11 rounded-xl border-white/10 text-sm font-medium text-white/60 transition-all duration-300 hover:text-white/90"
								type="button"
								disabled={isPending}
								onClick={() =>
									authClient.signIn.social({
										provider,
										callbackURL: window.location.origin + "/play",
									})
								}
							>
								<Image
									src={oauthConfig[provider].logo}
									width={18}
									height={18}
									alt={`${oauthConfig[provider].label} logo`}
								/>
								{oauthConfig[provider].label}
							</Button>
						))}
					</div>

					{/* Divider */}
					<div className="flex items-center gap-4">
						<Separator className="flex-1 bg-white/6" />
						<span className="text-[11px] font-medium tracking-[0.15em] text-white/20 uppercase">
							or
						</span>
						<Separator className="flex-1 bg-white/6" />
					</div>
				</>
			)}

			{/* Registration form */}
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
					<FormField
						control={form.control}
						name="username"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-xs font-medium text-white/40">
									Username
								</FormLabel>
								<FormControl>
									<div className="relative">
										<User
											size={16}
											className="absolute top-1/2 left-3.5 -translate-y-1/2 text-white/20"
										/>
										<Input
											type="text"
											placeholder="factory_boss"
											className={inputClasses}
											{...field}
										/>
										{/* Availability indicator */}
										{isValidFormat && (
											<div className="absolute top-1/2 right-3.5 -translate-y-1/2">
												{isCheckingName ? (
													<Loader2
														size={14}
														className="animate-spin text-white/20"
													/>
												) : nameCheck?.available ? (
													<CheckCircle2
														size={14}
														className="text-emerald-400/70"
													/>
												) : nameCheck?.available === false ? (
													<XCircle
														size={14}
														className="text-red-400/70"
													/>
												) : null}
											</div>
										)}
									</div>
								</FormControl>
								<FormMessage />
								{/* Suggestions when name is taken */}
								{isValidFormat &&
									nameCheck?.available === false &&
									suggestions.length > 0 && (
										<p className="text-[11px] text-white/30">
											Essaie :{" "}
											{suggestions
												.map((s) => (
													<button
														key={s}
														type="button"
														onClick={() =>
															form.setValue("username", s, {
																shouldValidate: true,
															})
														}
														className="text-white/50 underline-offset-2 hover:text-white/80 hover:underline"
													>
														{s}
													</button>
												))
												.flatMap((el, i) => (i === 0 ? [el] : [", ", el]))}
										</p>
									)}
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-xs font-medium text-white/40">
									Email
								</FormLabel>
								<FormControl>
									<div className="relative">
										<Mail
											size={16}
											className="absolute top-1/2 left-3.5 -translate-y-1/2 text-white/20"
										/>
										<Input
											type="email"
											placeholder="you@example.com"
											className={inputClasses}
											{...field}
										/>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="grid grid-cols-2 gap-3">
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-xs font-medium text-white/40">
										Password
									</FormLabel>
									<FormControl>
										<div className="relative">
											<Lock
												size={16}
												className="absolute top-1/2 left-3.5 -translate-y-1/2 text-white/20"
											/>
											<Input
												type="password"
												placeholder="••••••••"
												className={inputClasses}
												{...field}
											/>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-xs font-medium text-white/40">
										Confirm
									</FormLabel>
									<FormControl>
										<div className="relative">
											<Lock
												size={16}
												className="absolute top-1/2 left-3.5 -translate-y-1/2 text-white/20"
											/>
											<Input
												type="password"
												placeholder="••••••••"
												className={inputClasses}
												{...field}
											/>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<Button
						type="submit"
						variant="ghost"
						disabled={isPending || nameCheck?.available === false}
						className="from-game-cyan to-game-cyan-muted text-game-bg hover:from-game-cyan hover:to-game-cyan-muted hover:text-game-bg mt-1 h-12 w-full rounded-2xl bg-linear-to-r text-sm font-bold shadow-[0_0_30px_rgba(0,212,255,0.2)] transition-all duration-300 hover:bg-linear-to-r hover:opacity-90 hover:shadow-[0_0_40px_rgba(0,212,255,0.3)]"
					>
						{isPending ? (
							<Loader2 size={18} className="animate-spin" />
						) : (
							"Create Account"
						)}
					</Button>
				</form>
			</Form>

			{/* Login link */}
			<p className="text-center text-sm text-white/30">
				Already have an account?{" "}
				<Link
					href="/login"
					className="text-game-cyan/70 hover:text-game-cyan font-medium transition-colors"
				>
					Sign in
				</Link>
			</p>
		</div>
	);
};

export default RegisterForm;
