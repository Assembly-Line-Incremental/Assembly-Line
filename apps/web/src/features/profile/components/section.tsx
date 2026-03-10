export function Section({
	icon: Icon,
	title,
	children,
}: {
	icon: React.ElementType;
	title: string;
	children: React.ReactNode;
}) {
	return (
		<div className="overflow-hidden rounded-2xl border border-white/6 bg-[#0D2035]/80 backdrop-blur-sm">
			<div className="flex items-center gap-3 border-b border-white/5 px-5 py-4">
				<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5">
					<Icon size={14} className="text-white/50" />
				</div>
				<h2 className="text-[13px] font-semibold tracking-wide text-white/70">{title}</h2>
			</div>
			<div className="p-5">{children}</div>
		</div>
	);
}
