> **[Omnidea](https://github.com/neonpixy/omnidea)** / **[Library](https://github.com/neonpixy/library)** / **FX** · For AI-assisted development, see [Library CLAUDE.md](https://github.com/neonpixy/library/blob/main/CLAUDE.md).

# @omnidea/fx


Visual effects primitives for Omnidea. Solid.js components and reactive primitives for animated color cycling, bevel text shadows, and glow effects.

## Usage

```typescript
import { Flash, RAINBOW } from '@omnidea/fx';

<Flash palette={RAINBOW} speed={() => 1.5}>
  FLASH TEXT
</Flash>
```

Or use the reactive primitive directly for custom rendering:

```typescript
import { createFlash, FIRE } from '@omnidea/fx';

const flash = createFlash({ palette: () => FIRE });

// Reactive signals
flash.body();    // current color
flash.lead();    // highlight color (one step ahead)
flash.trail();   // shadow color (one step behind)
flash.shadow();  // pre-built CSS text-shadow string
flash.angle();   // current bevel angle in degrees
```

## Exports

| Export | What |
|--------|------|
| `Flash` | Solid.js component -- renders children with animated color + bevel text-shadow |
| `createFlash` | Reactive primitive -- drives the animation loop, returns `FlashState` signals |
| `buildBevel` | Builds a CSS `text-shadow` string from lead/trail colors, angle, size, and blur |
| `lerpColor` | Linearly interpolates between two hex colors |
| `parseHex` | Parses `#RGB` or `#RRGGBB` into `[r, g, b]` |
| `hex` | Converts a number (0-255) to a two-digit hex string |
| `RAINBOW`, `FIRE`, `ICE`, `NEON`, `GOLD` | Built-in color palettes |
| `PALETTES` | Record of all built-in palettes by name |

## Flash Options

| Option | Type | Default | What It Does |
|--------|------|---------|-------------|
| `palette` | `Accessor<string[]>` | (required) | Color palette -- at least 2 hex colors |
| `speed` | `Accessor<number>` | `1.5` | Seconds per palette step. 0 = one step per frame |
| `hold` | `Accessor<number>` | `0.5` | Fraction of cycle spent on solid color before blending (0-1) |
| `bevelSize` | `Accessor<number>` | `2` | Bevel size in pixels |
| `bevelAngle` | `Accessor<number>` | `135` | Bevel angle in degrees (ignored when spin > 0) |
| `spin` | `Accessor<number>` | `0.5` | Bevel rotation speed in revolutions/second. 0 = static |
| `blur` | `Accessor<number>` | `0` | Blur radius for the bevel shadow in pixels |

## Distribution

Source-distributed (`"main": "./src/lib/index.ts"`). No build step needed for consumers -- import directly from source.

## Requirements

- `solid-js` peer dependency

## License

Licensed under the Omninet Covenant License.
