import { useState } from "react";
import { cn } from "@/lib/utils";
import { getAvatarColor, getInitials } from "@/features/profile/constants";

export interface AvatarProps {
	name: string;
	image?: string | null;
	size?: "sm" | "lg";
}

export function Avatar({ name, image, size = "sm" }: AvatarProps) {
	const c = getAvatarColor(name);
	const sizeClass = size === "lg" ? "h-10 w-10" : "h-9 w-9";
	const [prevImage, setPrevImage] = useState(image);
	const [imageError, setImageError] = useState(false);

	if (image !== prevImage) {
		setPrevImage(image);
		setImageError(false);
	}

	if (image && !imageError) {
		return (
			<img
				src={image}
				alt={name}
				className={cn("shrink-0 rounded-full object-cover ring-1", sizeClass)}
				style={{ "--tw-ring-color": c.ring } as React.CSSProperties}
				onError={() => setImageError(true)}
			/>
		);
	}

	return (
		<div
			className={cn(
				"flex shrink-0 items-center justify-center rounded-full font-bold ring-1",
				size === "lg" ? "text-sm" : "text-[14px]",
				sizeClass
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
