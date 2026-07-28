# Room Background Assets

The fourteen production room backgrounds live here. Every scene is a fixed-camera 16:9 pixel-art plate with hotspot coordinates defined in `src/game/adventure.ts`.

Station interiors:

- `cryo-chamber.png` - used by the Cryo Chamber room.
- `cryo-annex.png` - used by the Cryo Annex / Remaining Sleepers room.
- `decontamination-hall.png` - used by the Decontamination Hall room.
- `broken-research-lab.png` - used by the Broken Research Lab room.
- `clean-room.png` - used by the Clean Room room.
- `medical-bay.png` - used by the Medical Bay room.
- `crew-quarters.png` - used by the Crew Quarters room.
- `mess-rec.png` - used by the Mess / Rec Room room.
- `comms-room.png` - used by the Comms Room room.
- `power-junction.png` - used by the Power Junction room.

Surface and finale scenes:

- `station-exterior.png` - station apron, satellite wreck, and first terraformer sighting.
- `basalt-canyon.png` - terraformer strike and shelter deduction.
- `cargo-rover.png` - the Khepri-6 rover wreck and burial site.
- `rover-uplink.png` - final command cabin and safe-hold puzzle.

Keep replacements at 16:9, preserve the existing pixel density and palette, and update hotspot rectangles if scene geometry changes. Missing images intentionally fail to the optical-feed loading state rather than substituting unrelated art.
