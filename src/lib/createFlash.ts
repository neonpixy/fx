import { createSignal, onMount, onCleanup, type Accessor } from 'solid-js';
import { lerpColor } from './color';

export interface FlashOptions {
	/** Color palette — at least 2 hex colors. */
	palette: Accessor<string[]>;
	/** Seconds per palette step. 0 = one step per frame. Default 1.5. */
	speed?: Accessor<number>;
	/** Fraction of cycle spent on solid color before blending (0-1). Default 0.5. */
	hold?: Accessor<number>;
	/** Bevel size in pixels. Default 2. */
	bevelSize?: Accessor<number>;
	/** Bevel angle in degrees. Ignored when spin > 0. Default 135. */
	bevelAngle?: Accessor<number>;
	/** Bevel rotation speed in revolutions/second. 0 = static. Default 0.5. */
	spin?: Accessor<number>;
	/** Blur radius for the bevel shadow in pixels. Default 0. */
	blur?: Accessor<number>;
}

export interface FlashState {
	/** Highlight color (one step ahead in palette). */
	lead: Accessor<string>;
	/** Main body color (current palette position). */
	body: Accessor<string>;
	/** Shadow color (one step behind in palette). */
	trail: Accessor<string>;
	/** Current bevel angle in degrees (animated when spin > 0). */
	angle: Accessor<number>;
	/** Pre-built CSS text-shadow string for bevel effect. */
	shadow: Accessor<string>;
}

/** Build bevel text-shadow from lead/trail colors at a given angle, size, and blur. */
export function buildBevel(lead: string, trail: string, size: number, angle: number, blur: number): string {
	const a = angle * Math.PI / 180;
	const shadows: string[] = [];

	for (let d = 1; d <= size; d++) {
		const dx = Math.cos(a) * d;
		const dy = Math.sin(a) * d;
		shadows.push(`${dx.toFixed(1)}px ${dy.toFixed(1)}px ${blur}px ${lead}`);
		shadows.push(`${(dx * 0.7).toFixed(1)}px ${(dy * 0.3).toFixed(1)}px ${blur}px ${lead}`);
		shadows.push(`${(dx * 0.3).toFixed(1)}px ${(dy * 0.7).toFixed(1)}px ${blur}px ${lead}`);
	}

	for (let d = 1; d <= size; d++) {
		const dx = -Math.cos(a) * d;
		const dy = -Math.sin(a) * d;
		shadows.push(`${dx.toFixed(1)}px ${dy.toFixed(1)}px ${blur}px ${trail}`);
		shadows.push(`${(dx * 0.7).toFixed(1)}px ${(dy * 0.3).toFixed(1)}px ${blur}px ${trail}`);
		shadows.push(`${(dx * 0.3).toFixed(1)}px ${(dy * 0.7).toFixed(1)}px ${blur}px ${trail}`);
	}

	return shadows.join(', ');
}

/**
 * Solid.js primitive that drives the Flash animation loop.
 * Returns reactive lead/body/trail colors and a pre-built CSS text-shadow.
 * Use directly for canvas rendering, or pass to <Flash> for automatic text styling.
 */
export function createFlash(options: FlashOptions): FlashState {
	const speed = options.speed ?? (() => 1.5);
	const hold = options.hold ?? (() => 0.5);
	const bevelSize = options.bevelSize ?? (() => 2);
	const bevelAngle = options.bevelAngle ?? (() => 135);
	const spin = options.spin ?? (() => 0.5);
	const blur = options.blur ?? (() => 0);

	const [lead, setLead] = createSignal('#ffffff');
	const [body, setBody] = createSignal('#ffffff');
	const [trail, setTrail] = createSignal('#ffffff');
	const [angle, setAngle] = createSignal(bevelAngle());
	const [shadow, setShadow] = createSignal('');

	let rafId: number;

	onMount(() => {
		const start = performance.now();

		function tick(now: number) {
			const p = options.palette();
			const n = p.length;
			if (!n) { rafId = requestAnimationFrame(tick); return; }

			const elapsed = (now - start) / 1000;
			const spd = speed();
			const h = hold();

			// Spin bevel angle
			const s = spin();
			const currentAngle = s > 0 ? (elapsed * 360 * s) % 360 : bevelAngle();
			setAngle(currentAngle);

			// Palette position
			const t = spd > 0 ? elapsed / spd : elapsed * 60;
			const raw = t % 1;
			const idx = Math.floor(t) % n;

			// Hold logic
			let frac: number;
			if (raw < h) {
				frac = 0;
			} else if (h < 1) {
				frac = (raw - h) / (1 - h);
			} else {
				frac = 0;
			}

			const bodyColor = lerpColor(p[idx], p[(idx + 1) % n], frac);
			const leadColor = lerpColor(p[(idx + 1) % n], p[(idx + 2) % n], frac);
			const trailColor = lerpColor(p[((idx - 1) % n + n) % n], p[idx], frac);

			setBody(bodyColor);
			setLead(leadColor);
			setTrail(trailColor);
			setShadow(buildBevel(leadColor, trailColor, bevelSize(), currentAngle, blur()));

			rafId = requestAnimationFrame(tick);
		}

		rafId = requestAnimationFrame(tick);
	});

	onCleanup(() => cancelAnimationFrame(rafId));

	return { lead, body, trail, angle, shadow };
}
