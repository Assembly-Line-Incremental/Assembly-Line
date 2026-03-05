/**
 * Format a large number as a compact string.
 * Examples: 123 → "123", 1500 → "1.5K", 2_300_000 → "2.3M", 1.2e15 → "1.2e15"
 */
export function formatValue(n: number): string {
	if (!isFinite(n)) return n > 0 ? "∞" : n < 0 ? "-∞" : "—";
	const abs = Math.abs(n);

	if (abs < 1e3) {
		const rounded = Math.round(n);
		if (Math.abs(rounded) < 1000) return rounded.toString();
		// n rounds up to ±1000 — fall through to K formatter
	}

	if (abs < 1e6) {
		const v = (n / 1e3).toFixed(1);
		return (v.endsWith(".0") ? v.slice(0, -2) : v) + "K";
	}

	if (abs < 1e9) {
		const v = (n / 1e6).toFixed(1);
		return (v.endsWith(".0") ? v.slice(0, -2) : v) + "M";
	}

	// Scientific notation for values ≥ 1B
	const exp = Math.floor(Math.log10(abs));
	const mantissa = n / Math.pow(10, exp);
	const m = mantissa.toFixed(1);
	return `${m.endsWith(".0") ? m.slice(0, -2) : m}e${exp}`;
}

/**
 * Format a production rate with sign.
 * Examples: 1500 → "+1.5K/s", -500 → "-500/s", ~0 → "—"
 */
export function formatRate(rate: number): string {
	if (Math.abs(rate) < 0.01) return "—";
	const sign = rate > 0 ? "+" : "";
	return `${sign}${formatValue(rate)}/s`;
}
