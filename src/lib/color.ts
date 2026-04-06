/** Parse a hex color string (#RGB or #RRGGBB) into [r, g, b]. */
export function parseHex(c: string): [number, number, number] {
	const h = c.replace('#', '');
	if (h.length === 3)
		return [parseInt(h[0] + h[0], 16), parseInt(h[1] + h[1], 16), parseInt(h[2] + h[2], 16)];
	return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

/** Convert a number (0-255) to a two-digit hex string. */
export function hex(n: number): string {
	return n.toString(16).padStart(2, '0');
}

/** Linearly interpolate between two hex colors. t=0 returns a, t=1 returns b. */
export function lerpColor(a: string, b: string, t: number): string {
	const pa = parseHex(a), pb = parseHex(b);
	return `#${hex(Math.round(pa[0] + (pb[0] - pa[0]) * t))}${hex(Math.round(pa[1] + (pb[1] - pa[1]) * t))}${hex(Math.round(pa[2] + (pb[2] - pa[2]) * t))}`;
}
