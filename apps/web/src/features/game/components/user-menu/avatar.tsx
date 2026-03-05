import { cn } from "@/lib/utils";

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

export interface AvatarProps {
	name: string;
	size?: "sm" | "lg";
}

export function Avatar({ name, size = "sm" }: AvatarProps) {
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
