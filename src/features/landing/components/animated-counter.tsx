"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
	value: string;
	className?: string;
}

export function AnimatedCounter({ value, className = "" }: AnimatedCounterProps) {
	const ref = useRef<HTMLSpanElement>(null);
	const [display, setDisplay] = useState("0");
	const hasAnimated = useRef(false);

	useEffect(() => {
		const el = ref.current;
		/* istanbul ignore next -- @preserve */
		if (!el) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && !hasAnimated.current) {
					hasAnimated.current = true;

					const numericMatch = value.match(/^(\d+)/);
					if (!numericMatch) {
						setDisplay(value);
						return;
					}

					const target = parseInt(numericMatch[1], 10);
					const suffix = value.slice(numericMatch[1].length);
					const duration = 1200;
					const startTime = performance.now();

					const animate = (now: number) => {
						const elapsed = now - startTime;
						const progress = Math.min(elapsed / duration, 1);
						const eased = 1 - Math.pow(1 - progress, 3);
						const current = Math.round(eased * target);
						setDisplay(`${current}${suffix}`);
						if (progress < 1) requestAnimationFrame(animate);
					};
					requestAnimationFrame(animate);
				}
			},
			{ threshold: 0.5 }
		);

		observer.observe(el);
		return () => observer.disconnect();
	}, [value]);

	return (
		<span ref={ref} className={className}>
			{display}
		</span>
	);
}
