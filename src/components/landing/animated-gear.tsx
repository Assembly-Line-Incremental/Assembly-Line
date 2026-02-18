"use client";

interface AnimatedGearProps {
	size?: number;
	color?: string;
	duration?: number;
	reverse?: boolean;
	className?: string;
}

export function AnimatedGear({
	size = 80,
	color = "#00D4FF",
	duration = 20,
	reverse = false,
	className = "",
}: AnimatedGearProps) {
	const teeth = 10;
	const outerR = size / 2;
	const innerR = outerR * 0.72;
	const tipR = outerR * 0.96;
	const rootR = innerR * 0.92;
	const holeR = outerR * 0.28;
	const ringR = outerR * 0.45;
	const toothArc = (Math.PI * 2) / teeth;
	const halfTooth = toothArc * 0.22;
	const halfGap = toothArc * 0.22;

	// Build smooth gear path with arc-rounded teeth
	const d: string[] = [];
	for (let i = 0; i < teeth; i++) {
		const center = i * toothArc;
		// tooth tip start and end
		const tipStart = center - halfTooth;
		const tipEnd = center + halfTooth;
		// root gap start and end
		const gapStart = center + toothArc / 2 - halfGap;
		const gapEnd = center + toothArc / 2 + halfGap;

		if (i === 0) {
			d.push(
				`M ${(Math.cos(tipStart) * tipR).toFixed(2)} ${(Math.sin(tipStart) * tipR).toFixed(2)}`
			);
		}

		// Arc across the tooth tip
		d.push(
			`A ${tipR} ${tipR} 0 0 1 ${(Math.cos(tipEnd) * tipR).toFixed(2)} ${(Math.sin(tipEnd) * tipR).toFixed(2)}`
		);

		// Line down to root
		d.push(
			`L ${(Math.cos(gapStart) * rootR).toFixed(2)} ${(Math.sin(gapStart) * rootR).toFixed(2)}`
		);

		// Arc across the root gap
		d.push(
			`A ${rootR} ${rootR} 0 0 1 ${(Math.cos(gapEnd) * rootR).toFixed(2)} ${(Math.sin(gapEnd) * rootR).toFixed(2)}`
		);

		// Line up to next tooth tip
		const nextTipStart = (i + 1) * toothArc - halfTooth;
		d.push(
			`L ${(Math.cos(nextTipStart) * tipR).toFixed(2)} ${(Math.sin(nextTipStart) * tipR).toFixed(2)}`
		);
	}
	d.push("Z");

	return (
		<svg
			width={size}
			height={size}
			viewBox={`${-outerR - 2} ${-outerR - 2} ${(outerR + 2) * 2} ${(outerR + 2) * 2}`}
			className={className}
			aria-hidden="true"
		>
			<g
				style={{
					animation: `${reverse ? "spin-slow-reverse" : "spin-slow"} ${duration}s linear infinite`,
					transformOrigin: "center",
				}}
			>
				{/* Gear body */}
				<path d={d.join(" ")} fill={color} opacity={0.85} />
				{/* Inner ring detail */}
				<circle
					r={ringR}
					fill="none"
					stroke={color}
					strokeWidth={outerR * 0.06}
					opacity={0.3}
				/>
			</g>
			{/* Center hole */}
			<circle r={holeR} fill="#0A1A2F" />
		</svg>
	);
}
