"use client";

import { useEffect, useRef } from "react";

interface Particle {
	x: number;
	y: number;
	vx: number;
	vy: number;
	size: number;
	opacity: number;
	color: string;
}

export function ParticleField() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		/* istanbul ignore next -- @preserve */
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		/* istanbul ignore next -- @preserve */
		if (!ctx) return;

		let animationId: number;
		const particles: Particle[] = [];
		const colors = ["#00D4FF", "#0088BB", "#FF4422", "#FFBB44", "#005577"];

		const resize = () => {
			const prevW = canvas.width || 1;
			const prevH = canvas.height || 1;
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			// Rescale particle positions proportionally
			for (const p of particles) {
				p.x = (p.x / prevW) * canvas.width;
				p.y = (p.y / prevH) * canvas.height;
			}
		};
		resize();
		window.addEventListener("resize", resize);

		for (let i = 0; i < 60; i++) {
			particles.push({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				vx: (Math.random() - 0.5) * 0.3,
				vy: (Math.random() - 0.5) * 0.3,
				size: Math.random() * 2 + 0.5,
				opacity: Math.random() * 0.5 + 0.1,
				color: colors[Math.floor(Math.random() * colors.length)],
			});
		}

		const draw = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			for (const p of particles) {
				p.x += p.vx;
				p.y += p.vy;
				/* istanbul ignore next -- @preserve */
				if (p.x < 0) p.x = canvas.width;
				/* istanbul ignore next -- @preserve */
				if (p.x > canvas.width) p.x = 0;
				/* istanbul ignore next -- @preserve */
				if (p.y < 0) p.y = canvas.height;
				/* istanbul ignore next -- @preserve */
				if (p.y > canvas.height) p.y = 0;

				ctx.beginPath();
				ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
				ctx.fillStyle = p.color;
				ctx.globalAlpha = p.opacity;
				ctx.fill();
			}

			// Draw connections
			ctx.globalAlpha = 1;
			for (let i = 0; i < particles.length; i++) {
				for (let j = i + 1; j < particles.length; j++) {
					const dx = particles[i].x - particles[j].x;
					const dy = particles[i].y - particles[j].y;
					const dist = Math.sqrt(dx * dx + dy * dy);
					if (dist < 120) {
						ctx.beginPath();
						ctx.moveTo(particles[i].x, particles[i].y);
						ctx.lineTo(particles[j].x, particles[j].y);
						ctx.strokeStyle = "#00D4FF";
						ctx.globalAlpha = (1 - dist / 120) * 0.08;
						ctx.lineWidth = 0.5;
						ctx.stroke();
					}
				}
			}
			ctx.globalAlpha = 1;
			animationId = requestAnimationFrame(draw);
		};

		draw();
		return () => {
			cancelAnimationFrame(animationId);
			window.removeEventListener("resize", resize);
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			className="pointer-events-none fixed inset-0 z-0"
			aria-hidden="true"
		/>
	);
}
