import { z } from "zod";

export const nameSchema = z.object({
	name: z
		.string()
		.trim()
		.min(3, "3 caractères minimum")
		.max(20, "20 caractères maximum")
		.regex(/^[a-zA-Z0-9_-]+$/, "Lettres, chiffres, _ et - uniquement")
		.toLowerCase(),
});
export type NameForm = z.infer<typeof nameSchema>;

export const passwordSchema = z
	.object({
		currentPassword: z.string().min(1, "Requis"),
		newPassword: z.string().min(8, "8 caractères minimum").max(100),
		confirmPassword: z.string().min(1, "Requis"),
	})
	.refine((d) => d.newPassword === d.confirmPassword, {
		message: "Les mots de passe ne correspondent pas",
		path: ["confirmPassword"],
	});
export type PasswordForm = z.infer<typeof passwordSchema>;
