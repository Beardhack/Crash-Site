# Crash Site HUD Plan

This is a handoff plan for redesigning the game HUD after the first five generated room backgrounds were added.

## Current State

The game is a Vite + React + TypeScript static app.

Local URL:

```text
http://127.0.0.1:5173/
```

Room background system is already implemented:

- Room data supports `art: { src, alt }`.
- `PixelScene` loads the image if present.
- Missing images fall back to procedural CSS room art.
- First five rooms now use generated CCTV pixel art.

Current room art files:

```text
public/assets/rooms/cryo-chamber.png
public/assets/rooms/cryo-annex.png
public/assets/rooms/decontamination-hall.png
public/assets/rooms/broken-research-lab.png
public/assets/rooms/clean-room.png
```

Relevant files:

```text
src/App.tsx
src/components/PixelScene.tsx
src/game/data.ts
src/game/types.ts
src/styles.css
art-prompts/00-cctv-hud-shell.md
```

## What Is Working

The generated room art direction is working very well:

- CCTV / surveillance camera viewpoint.
- Retro pixel-art scanline treatment.
- Grounded industrial NASA/off-world station mood.
- High-detail room backgrounds with clear gameplay anchors.

The HUD is currently functional but visually not on the same level as the room art. It has the right conceptual shape, but it still reads too much like CSS panels around beautiful art.

## HUD Direction

The HUD should feel like:

- An old off-world station CCTV workstation.
- A damaged industrial mission terminal.
- Chunky 1980s/1990s sci-fi hardware.
- Physical console panels, not a modern web app.
- Surveillance monitor with live room feed.
- Amber/cyan/red limited accent palette.
- Worn metal/plastic bezels, vents, screws, hazard marks, dark glass.

The player should feel like they are operating a station terminal, not just playing inside a normal browser layout.

## Important Rule

Keep gameplay text and controls as live HTML/CSS.

Do **not** bake readable text into generated HUD images. The game needs to dynamically render:

- room name
- cluster/current room id
- oxygen/power
- exits
- logs count
- inventory items
- feedback text
- modal contents

Generated HUD art should be used as decorative frame/backplate/panel texture only.

## Generated HUD Assets Reviewed

The original image-model reference assets were reviewed locally but are not included in this repository:

```text
Piece 1.png
Piece 2.png
Piece 3.png
Piece 4.png
Full HUD.png
```

Technical issue:

- They are `Format24bppRgb`.
- They do **not** have real transparency.
- The checkerboard background is baked in.

Conclusion:

- Good as visual inspiration.
- Not good as direct overlay assets unless regenerated with true alpha or manually cleaned.

Most useful references:

- `Full HUD.png`: best overall layout inspiration.
- `Piece 2.png`: strong right-side panel inspiration.
- `Piece 4.png`: useful blank button-state inspiration.

## Recommended HUD Build Strategy

Use CSS/HTML for layout and generated image-inspired styling.

Avoid relying on one giant raster overlay because:

- responsive layout becomes brittle
- text alignment becomes difficult
- baked scaling artifacts can hurt readability
- click targets and browser UI need real DOM

Instead, implement an “industrial console skin” with:

- CSS panel frames
- pseudo-elements for screws/vents/warning lights
- dark inset display wells
- reusable button plate classes
- optional small PNG textures later

## Target Layout

Desktop-first layout:

```text
┌───────────────────────────────────────────────────────────────┐
│ Top hardware/status strip                                     │
│ [station plate] [room identity]              [O2] [Power]      │
├─────────────────────────────────────────────┬─────────────────┤
│ Camera viewport                             │ Right console   │
│ large 16:9 room image                       │ route buttons   │
│ CCTV overlays + hotspot cues                │ archive/logs    │
├─────────────────────────────────────────────┴─────────────────┤
│ Bottom command console                                         │
│ SYS MSG / feedback text             inventory tray             │
└───────────────────────────────────────────────────────────────┘
```

Keep the central room art as large as possible. The room art is the star.

## Visual Rules

- No rounded modern cards.
- No generic gradients.
- No huge empty black gutters.
- Use dense but readable hardware panels.
- Use `box-shadow`, `border-image`-like effects, pseudo-elements, and repeating gradients for panel texture.
- Use amber/cyan/red only as accents, not full-page color washes.
- Buttons should feel like physical inset plates.
- Text areas should look like dark CRT glass.
- Inventory should look like a slotted hardware tray.
- Side nav should look like a modular terminal rack.

## CSS Components To Create

Suggested reusable classes:

```text
.hud-shell
.hud-top
.hud-plate
.hud-meter
.hud-main
.hud-viewport
.hud-side
.hud-section
.hud-button
.hud-bottom
.hud-message
.hud-inventory
.hud-slot
.hud-screw
.hud-vent
.hud-warning-light
```

Current equivalent classes already exist and can be refactored instead of starting over:

```text
.app
.topbar
.system-plate
.meters
.meter
.game-shell
.viewport-console
.viewport-readout
.viewport-strip
.side-panel
.panel-section
.exit-list
.command-bar
.feedback
.inventory
.inventory-item
```

## Implementation Steps

1. Rename or reorganize the current HUD CSS into a dedicated section in `src/styles.css`.
2. Make the app shell denser and more hardware-like.
3. Reduce oversized black empty space below the room viewport.
4. Let the central viewport maintain 16:9 but constrain height better on desktop.
5. Restyle the top bar using the generated `Full HUD.png` proportions as inspiration.
6. Restyle right panel based on `Piece 2.png`: stacked dark wells, screw corners, vents, amber separators.
7. Restyle bottom command/inventory based on `Piece 1.png` and `Piece 4.png`: long dark display, button plates, slots.
8. Keep all room art images edge-to-edge inside the viewport.
9. Keep hotspot cues visible but consider making them subtler over generated art.
10. Build with `npm run build`.
11. Check local server at `http://127.0.0.1:5173/`.

## Possible Asset Prompt Revision

If generating another HUD pass, ask for:

```text
transparent PNG with real alpha channel, no checkerboard background, no readable text, no room art, no cursor, no completed screenshot. Create separate modular HUD frame assets: top status strip, right panel, bottom message/inventory panel, blank button states, and optional full-frame overlay. Dark empty glass wells where live HTML text will be rendered.
```

Explicitly avoid:

```text
checkerboard background, baked labels, baked numbers, fake UI text, room image, browser window, full screenshot mockup
```

## Current Priority

Before making more room art, do one HUD polish pass so the interface matches the quality of the generated rooms.

The goal is not to replace the live UI with images. The goal is to make the live UI look like it belongs to the same world as the images.
