import { type JSX, type Accessor, splitProps, mergeProps } from 'solid-js';
import { createFlash, type FlashOptions } from './createFlash';

export interface FlashProps extends Omit<FlashOptions, 'palette'> {
	/** Color palette — at least 2 hex colors. Can be reactive. */
	palette: Accessor<string[]> | string[];
	/** Content to render with the flash effect. */
	children: JSX.Element;
	/** Additional CSS class. */
	class?: string;
	/** Additional inline styles. */
	style?: JSX.CSSProperties;
}

/**
 * Renders children with an animated color bevel effect.
 * Colors cycle through the palette with configurable speed, hold, and bevel parameters.
 *
 * ```tsx
 * <Flash palette={['#ff0000', '#ff8800', '#ffff00']} speed={() => 1.5}>
 *   FLASH
 * </Flash>
 * ```
 */
export function Flash(props: FlashProps) {
	const [local, flashOpts] = splitProps(props, ['children', 'class', 'style']);

	const palette = typeof props.palette === 'function'
		? props.palette
		: () => props.palette as string[];

	const flash = createFlash({ ...flashOpts, palette });

	return (
		<div
			class={local.class}
			style={{
				...local.style,
				color: flash.body(),
				'text-shadow': flash.shadow(),
			}}
		>
			{local.children}
		</div>
	);
}
