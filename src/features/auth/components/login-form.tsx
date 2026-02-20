"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { authClient } from "@/lib/auth/auth-client";
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
import { Loader2, Mail, Lock } from "lucide-react";

const loginSchema = z.object({
	email: z.email("Please provide a valid email address"),
	password: z.string().min(8, "Password must be at least 8 characters long"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
	const router = useRouter();
	const form = useForm({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: LoginFormValues) => {
		await authClient.signIn.email(
			{
				email: data.email,
				password: data.password,
				callbackURL: "/",
			},
			{
				onSuccess: () => {
					router.push("/");
				},
				onError: (error) => {
					toast.error(error.error.message);
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
			<div className="flex gap-3">
				<Button
					variant="outline"
					className="bg-game-bg-deep hover:border-game-cyan/25 hover:bg-game-bg-deep h-11 flex-1 rounded-xl border-white/10 text-sm font-medium text-white/60 transition-all duration-300 hover:text-white/90"
					type="button"
					disabled={isPending}
					onClick={() => authClient.signIn.social({ provider: "github" })}
				>
					<Image src="/logos/github.svg" width={18} height={18} alt="GitHub logo" />
					GitHub
				</Button>
				<Button
					variant="outline"
					className="bg-game-bg-deep hover:border-game-cyan/25 hover:bg-game-bg-deep h-11 flex-1 rounded-xl border-white/10 text-sm font-medium text-white/60 transition-all duration-300 hover:text-white/90"
					type="button"
					disabled={isPending}
				>
					<Image src="/logos/google.svg" width={18} height={18} alt="Google logo" />
					Google
				</Button>
			</div>

			{/* Divider */}
			<div className="flex items-center gap-4">
				<Separator className="flex-1 bg-white/6" />
				<span className="text-[11px] font-medium tracking-[0.15em] text-white/20 uppercase">
					or
				</span>
				<Separator className="flex-1 bg-white/6" />
			</div>

			{/* Email / Password form */}
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
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

					<Button
						type="submit"
						variant="ghost"
						disabled={isPending}
						className="from-game-cyan to-game-cyan-muted text-game-bg hover:from-game-cyan hover:to-game-cyan-muted hover:text-game-bg mt-1 h-12 w-full rounded-2xl bg-linear-to-r text-sm font-bold shadow-[0_0_30px_rgba(0,212,255,0.2)] transition-all duration-300 hover:bg-linear-to-r hover:opacity-90 hover:shadow-[0_0_40px_rgba(0,212,255,0.3)]"
					>
						{isPending ? <Loader2 size={18} className="animate-spin" /> : "Sign In"}
					</Button>
				</form>
			</Form>

			{/* Sign up link */}
			<p className="text-center text-sm text-white/30">
				Don&apos;t have an account?{" "}
				<Link
					href="/signup"
					className="text-game-cyan/70 hover:text-game-cyan font-medium transition-colors"
				>
					Sign up
				</Link>
			</p>
		</div>
	);
};

export default LoginForm;
