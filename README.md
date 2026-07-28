# Crash Site

**[Play Crash Site in your browser](https://beardhack.github.io/Crash-Site/)**

Crash Site is a complete, linear pixel point-and-click science-fiction adventure for the browser. A failed cryostasis cycle wakes the player 887 million years late inside Research Bay One. They must stabilize life support, restore the damaged assistant AI Apollo, follow a dead crew's Cargo Rover beacon, and interrupt an orbital terraformer that has mistaken the planet for an empty world.

The intended first playthrough is 20–30 minutes. The game is turn-based: oxygen, storms, and machine events never advance while the player reads or thinks. It has one authored ending, no randomization, no combat, no dead ends, contextual hints, autosave, a finite signal-trace scan system, and responsive layouts.

## Run locally

```bash
npm install
npm run dev
```

Vite prints the local URL, normally `http://127.0.0.1:5173/`.

## Production build

```bash
npm run build
```

The static production site is emitted to `dist/`.

## Controls

- Click scene objects to inspect or interact.
- Enter new spaces through visible doors, hatches, trails, or the route strip beneath the scene. Some routes need a local clue, repaired system, or equipped tool before they open.
- Select an inventory item, then click the object where it should be used.
- Press `Tab` to pulse every local signal briefly. Pulses consume charge and raise the station's detectable signal trace.
- Press `Escape` to close the current dialogue or panel.
- The site map reveals rooms only after entry and allows travel only to a directly adjacent visited room.

## Structure

- `src/game/adventure.ts` — rooms, hotspots, inventory, notes, puzzles, state transitions, objectives, and hints.
- `src/App.tsx` — application shell, autosave, dialogue, inventory, and puzzle panels.
- `src/components/PixelScene.tsx` — scene rendering and accessible hotspot layer.
- `src/styles.css` — the complete responsive game interface.
- `public/assets/rooms/` — fourteen 16:9 pixel-art scene backgrounds.

## GitHub Pages

The project includes `.github/workflows/pages.yml`. Configure GitHub Pages to use **GitHub Actions** as its source. The Vite base path is derived automatically from `GITHUB_REPOSITORY` during Actions builds; set `BASE_PATH` to override it.
