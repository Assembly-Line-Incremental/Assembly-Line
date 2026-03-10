export const AVATAR_COLORS = [
	{ bg: "#00D4FF15", text: "#00D4FF", ring: "#00D4FF25" },
	{ bg: "#FF773315", text: "#FF7733", ring: "#FF773325" },
	{ bg: "#FFBB4415", text: "#FFBB44", ring: "#FFBB4425" },
	{ bg: "#A855F715", text: "#A855F7", ring: "#A855F725" },
	{ bg: "#22C55E15", text: "#22C55E", ring: "#22C55E25" },
] as const;

export function getAvatarColor(name: string) {
	let h = 0;
	for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
	return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

export function getInitials(name: string) {
	return name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((w) => w[0]?.toUpperCase() ?? "")
		.join("");
}

export const STATUS_CONFIG = {
	ONLINE: { label: "En ligne", color: "#22C55E", pulse: true },
	IDLE: { label: "Inactif", color: "#FFBB44", pulse: false },
	OFFLINE: { label: "Hors ligne", color: "#6B7280", pulse: false },
} as const;

export const PRESET_AVATARS = [
	"https://api.dicebear.com/9.x/pixel-art/svg?seed=Felix&size=200",
	"https://api.dicebear.com/9.x/pixel-art/svg?seed=Aneka&size=200",
	"https://api.dicebear.com/9.x/pixel-art/svg?seed=Misty&size=200",
	"https://api.dicebear.com/9.x/pixel-art/svg?seed=Shadow&size=200",
	"https://api.dicebear.com/9.x/pixel-art/svg?seed=Nala&size=200",
	"https://api.dicebear.com/9.x/pixel-art/svg?seed=Cleo&size=200",
] as const;
