# 00 - CCTV HUD Shell / Game Interface Skin

## Goal

Create visual assets for the **game interface shell**, not a completed screenshot. The generated art should provide the empty retro workstation/CCTV frame that the live game can populate with HTML text, buttons, meters, inventory items, route names, and log counts.

This should feel like the player is operating an old off-world station surveillance terminal: part CCTV monitor, part 1980s mission workstation, part industrial emergency console.

## Best Output Format

Preferred: a small UI kit of transparent PNG assets, not one flattened screenshot.

Generate these assets as separate transparent-background images:

1. `hud-full-frame.png`
   - Full-screen 16:9 interface frame.
   - Empty central viewport cutout for room art.
   - Empty right-side navigation panel.
   - Empty bottom message/inventory panels.
   - No readable text.

2. `hud-top-plate.png`
   - Empty top status/header strip.
   - Includes colored mission-system blocks, bevels, industrial panel seams.
   - Leave clear blank zones where live title, room name, oxygen, and power text can be rendered.

3. `hud-side-panel.png`
   - Empty right navigation/archive panel frame.
   - Blank button slots, no labels.
   - Strong retro workstation styling.

4. `hud-bottom-panel.png`
   - Empty bottom command/message/inventory frame.
   - Blank message box and blank inventory tray slots.
   - No text.

5. `hud-button-states.png`
   - A small sprite sheet or separate blank button plates:
   - normal, hover, selected/armed, disabled.
   - No words or icons.

If a single image is easier, generate a **1920x1080 transparent PNG overlay** with all major interface panels and empty cutouts. But modular pieces are better for responsive implementation.

## Prompt

Create a retro sci-fi CCTV workstation HUD shell for a browser point-and-click adventure game called Crash Site. The interface should look like an old industrial station surveillance console, not a modern app and not a spaceship bridge. Use a grounded NASA/industrial sci-fi style: thick metal/plastic bezels, worn emergency-console panels, amber and cyan status blocks, chunky CRT monitor framing, scanline texture, black glass, warning-strip accents, physical panel seams, small screw heads, vents, and aged labels that are abstract or unreadable.

The layout should have a large central empty viewport for room camera footage, a top status/header area, a right-side route/archive panel, and bottom message/inventory panels. All areas where text would appear must be blank and dark enough for live HTML text to be rendered on top. Include empty button slots and empty meter wells, but do not include words, numbers, icons, timestamps, cursors, characters, room art, inventory items, or readable text.

The mood is old rescue telemetry, failing research station, CCTV camera feed, industrial emergency terminal. Pixel-art / pixel-painted style with modern polish. Strong silhouette, clean rectangular layout, readable blank spaces, not cluttered where text needs to go.

## Visual References To Evoke

- 1980s CRT workstation.
- Mission control hardware panels.
- Old point-and-click adventure command interface.
- CCTV monitor frame with scanline glass.
- Industrial safety consoles.
- Amber/cyan/red limited color accents.

## Must Be Empty

Leave these zones blank for the game to populate:

- Game title / station identifier plate.
- Current room name.
- Oxygen and power meters.
- Central camera viewport.
- Exit/route buttons.
- Log/archive buttons.
- Message text box.
- Inventory slots.

## Negative Prompt

No readable text, no labels, no numbers, no actual room background art, no characters, no cursor, no inventory objects, no completed game screenshot, no modern flat UI, no fantasy ornaments, no glossy cyberpunk neon overload, no photorealistic desktop computer, no browser chrome.

## Implementation Notes

The game will keep live UI text and controls in HTML/CSS. Use generated UI art as decorative frame/panel backgrounds only. Avoid putting meaningful text in the image because it cannot update during gameplay and will become unreadable at some sizes.
