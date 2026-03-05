import type { ElementType } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface MenuItemProps {
	icon: ElementType;
	label: string;
	href?: string;
	onClick?: () => void;
	danger?: boolean;
	disabled?: boolean;
}

export function MenuItem({ icon: Icon, label, href, onClick, danger, disabled }: MenuItemProps) {
	const cls = cn(
		"flex w-full items-center gap-2.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors duration-100",
		disabled
			? "cursor-not-allowed opacity-40"
			: danger
				? "cursor-pointer text-[#FF4422]/70 hover:bg-[#FF4422]/8 hover:text-[#FF4422]"
				: "cursor-pointer text-white/55 hover:bg-white/6 hover:text-white/90"
	);
	if (href) {
		return (
			<Link
				href={href}
				role="menuitem"
				aria-disabled={disabled ? "true" : undefined}
				tabIndex={disabled ? -1 : undefined}
				onClick={disabled ? (e) => e.preventDefault() : undefined}
				className={cls}
			>
				<Icon size={14} strokeWidth={2} />
				{label}
			</Link>
		);
	}
	return (
		<button
			type="button"
			role="menuitem"
			onClick={disabled ? undefined : onClick}
			disabled={disabled}
			className={cls}
		>
			<Icon size={14} strokeWidth={2} />
			{label}
		</button>
	);
}
