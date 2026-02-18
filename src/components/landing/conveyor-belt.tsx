export function ConveyorBelt() {
	return (
		<div className="relative w-full overflow-hidden py-3" aria-hidden="true">
			<div className="absolute inset-0 z-10 bg-linear-to-r from-[#0A1A2F] via-transparent to-[#0A1A2F]" />
			<div
				className="flex gap-8 whitespace-nowrap"
				style={{ animation: "conveyor 25s linear infinite" }}
			>
				{Array.from({ length: 20 }).map((_, i) => (
					<div key={i} className="flex items-center gap-8">
						<div className="h-1 w-12 rounded-full bg-[#00D4FF]/20" />
						<div className="h-2 w-2 rounded-full bg-[#FF7733]/40" />
					</div>
				))}
			</div>
		</div>
	);
}
