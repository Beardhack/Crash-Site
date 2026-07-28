export type RoomId =
  | "cryo"
  | "lab"
  | "power"
  | "decon"
  | "clean"
  | "medical"
  | "annex"
  | "quarters"
  | "mess"
  | "comms"
  | "exterior"
  | "canyon"
  | "rover"
  | "uplink";

export type ModalId = "power" | "clean" | "keypad" | "comms" | "final";

export interface Dialogue {
  speaker: string;
  title?: string;
  lines: string[];
  portrait?: "apollo" | "system" | "crew";
}

export interface Outcome {
  state: GameState;
  dialogue?: Dialogue;
  modal?: ModalId;
}

export interface GameState {
  version: 3;
  started: boolean;
  currentRoom: RoomId;
  inventory: string[];
  selectedItem: string | null;
  flags: string[];
  notes: string[];
  powerRoutes: CircuitId[];
  interactions: number;
  roomsVisited: RoomId[];
  scanCharges: number;
  signalTrace: number;
  lastMessage: string;
  ending: boolean;
}

export interface Hotspot {
  id: string;
  label: string;
  action: string;
  area: [number, number, number, number];
  kind?: "inspect" | "item" | "terminal" | "puzzle" | "exit";
  hiddenWhen?: string;
}

export interface Exit {
  to: RoomId;
  label: string;
  approach?: string;
  condition?: string;
  blocked: string;
}

export interface Room {
  id: RoomId;
  name: string;
  sector: string;
  image: string;
  description: string;
  ambience: string;
  hotspots: Hotspot[];
  exits: Exit[];
}

export interface Item {
  id: string;
  name: string;
  short: string;
  description: string;
  glyph: string;
}

export interface Note {
  id: string;
  title: string;
  source: string;
  body: string;
}

export type CircuitId = "life" | "doors" | "apollo";

export const circuits: Record<CircuitId, { name: string; cost: number; detail: string }> = {
  life: {
    name: "Life support",
    cost: 120,
    detail: "Seal Research Bay One and scrub the cryo contaminants.",
  },
  doors: {
    name: "Door motors",
    cost: 40,
    detail: "Release the station's magnetically frozen internal bulkheads.",
  },
  apollo: {
    name: "Apollo core",
    cost: 60,
    detail: "Restore cognition, archive access, and remote-machine control.",
  },
};

export const items: Record<string, Item> = {
  phaseCoupler: {
    id: "phaseCoupler",
    name: "Phase coupler",
    short: "Coupler",
    glyph: "⟐",
    description:
      "A ceramic bridge for mismatched power phases. One side is scorched; the other still holds a charge.",
  },
  vionScanner: {
    id: "vionScanner",
    name: "Drained Vion scanner",
    short: "Scanner",
    glyph: "◉",
    description:
      "A hovering black analysis disc. Its battery is empty, but its radiation and mineral sensors look intact.",
  },
  guardCore: {
    id: "guardCore",
    name: "Guard-bot logic core",
    short: "Logic core",
    glyph: "◇",
    description:
      "A fist-sized inference lattice from a guard bot too old to finish falling over.",
  },
  bioseal: {
    id: "bioseal",
    name: "Aerogel bioseal",
    short: "Bioseal",
    glyph: "▧",
    description:
      "A pressure-reactive repair membrane mixed by the clean-room cabinet. Flexible until exposed to vacuum.",
  },
  exoHarness: {
    id: "exoHarness",
    name: "Damaged Zeta harness",
    short: "Harness",
    glyph: "♙",
    description:
      "A sealed-environment exosuit with a long tear through its pressure layer. The frame still answers diagnostics.",
  },
  exoSuit: {
    id: "exoSuit",
    name: "Repaired Zeta suit",
    short: "Zeta suit",
    glyph: "♜",
    description:
      "A fully sealed Zeta-armor exosuit. The oxygen reserve is measured in days, not minutes.",
  },
  projectorCell: {
    id: "projectorCell",
    name: "Projector power cell",
    short: "Power cell",
    glyph: "▮",
    description:
      "Fifty nellons in a cracked blue shell. Somehow, an entertainment projector kept it isolated from the grid.",
  },
  chargedScanner: {
    id: "chargedScanner",
    name: "Charged Vion scanner",
    short: "Vion scanner",
    glyph: "◉",
    description:
      "The scanner now hovers at shoulder height, painting radiation and mineral structures in quiet blue wireframes.",
  },
  cobaltLens: {
    id: "cobaltLens",
    name: "Cobalt signal lens",
    short: "Signal lens",
    glyph: "⬡",
    description:
      "An orbital-grade focusing lens salvaged from the smashed survey satellite. Miraculously unclouded.",
  },
  roverCell: {
    id: "roverCell",
    name: "Rover reserve cell",
    short: "Reserve cell",
    glyph: "▥",
    description:
      "Ten nellons remain. Not enough to move the rover; enough to send one very important command.",
  },
};

export const noteLibrary: Record<string, Note> = {
  clock: {
    id: "clock",
    title: "Chronometer delta",
    source: "Cryostasis Chamber 2",
    body:
      "LOCAL ELAPSED TIME: 887,842,500 years, 7 months, 1 day, 6 hours, 42 minutes, 23 seconds. The clock reports no arithmetic fault.",
  },
  protocols: {
    id: "protocols",
    title: "Apollo's surviving protocols",
    source: "Experiment Chamber",
    body:
      "Three labels survive the archive collapse: Mapping 317; Biosphere Witness; Red Transcendence 2.9. Apollo cannot recall their proper order.",
  },
  cleanCycle: {
    id: "cleanCycle",
    title: "Sterilization cycle",
    source: "Clean Room air jets",
    body:
      "Manual purge marking: CYAN — AMBER — CYAN. The emergency materials cabinet uses the same pneumatic interlock.",
  },
  sleepers: {
    id: "sleepers",
    title: "Cryo Annex telemetry",
    source: "Cryo Annex",
    body:
      "Seven pods remain viable on an isolated eighty-nellon loop. Disconnecting the loop would wake none of them and kill all seven.",
  },
  mira: {
    id: "mira",
    title: "Mira Vale, last personal log",
    source: "Crew Quarters",
    body:
      "DAY 14: Sayeed put the surviving Zeta harness in locker 04 again. He never changes the emergency pin: launch month and day, 07/14. The beacon is still out there. I can hear it, but the storm owns the door.",
  },
  doctrine: {
    id: "doctrine",
    title: "Red Transcendence doctrine",
    source: "Mira's paper notebook",
    body:
      "The terraformer must LOCATE before it can LISTEN. It must LISTEN before it can HOLD. Never authorize Red Transcendence without a witnessed biosphere map.",
  },
  beacon: {
    id: "beacon",
    title: "Decoded cargo beacon",
    source: "Minor Comms",
    body:
      "Not an incoming rescue call. A local Cargo Rover repeats four pulses—LONG, SHORT, SHORT, LONG—and the coordinate KHEPRI-6.",
  },
  orbitalMap: {
    id: "orbitalMap",
    title: "Survey satellite map",
    source: "Station exterior",
    body:
      "The orbital body is a Red Transcendence terraformer. Its first strike vitrified the eastern basin. The Cargo Rover lies beyond a hollow basalt seam matching the scanner's blue return.",
  },
  roverCrew: {
    id: "roverCrew",
    title: "The last escape attempt",
    source: "Khepri-6 burial markers",
    body:
      "Six station crew reached the rover. They buried their dead, located the off-world ship, and waited for a storm that never ended. The final marker faces home.",
  },
};

export const rooms: Record<RoomId, Room> = {
  cryo: {
    id: "cryo",
    name: "Cryostasis Chamber 2",
    sector: "Research Bay 01",
    image: "/assets/rooms/cryo-chamber.png",
    description:
      "Cold vapor peels from your open pod. Two neighboring coffins still glow; everything else has learned to rust.",
    ambience: "POD THERMAL FAULT / LOCAL CLOCK UNTRUSTED",
    exits: [
      {
        to: "lab",
        label: "Experiment Chamber",
        approach: "Red-lit bulkhead",
        condition: "awake",
        blocked: "Your legs are not ready. Examine the open pod first.",
      },
    ],
    hotspots: [
      { id: "pod", label: "Open cryopod", action: "wake", area: [10, 22, 34, 60], kind: "inspect" },
      {
        id: "clock",
        label: "Chronometer",
        action: "clock",
        area: [3, 52, 14, 23],
        kind: "terminal",
      },
      {
        id: "sleepers",
        label: "Sealed pods",
        action: "cryoSleepers",
        area: [46, 24, 26, 39],
        kind: "inspect",
      },
      {
        id: "door",
        label: "Lab bulkhead",
        action: "go:lab",
        area: [77, 16, 13, 38],
        kind: "exit",
      },
    ],
  },
  lab: {
    id: "lab",
    name: "Experiment Chamber",
    sector: "Research Bay 01",
    image: "/assets/rooms/broken-research-lab.png",
    description:
      "Red daylight leaks through a wall that used to be load-bearing. Something green stirs in the dead projector.",
    ambience: "LAB PRESSURE 38% / ARCHIVE BUS OFFLINE",
    exits: [
      { to: "cryo", label: "Cryostasis Chamber 2", approach: "Red-lit bulkhead", blocked: "" },
      {
        to: "power",
        label: "Maintenance Junction",
        approach: "Shattered service gallery",
        condition: "apolloMet",
        blocked: "You cannot read the ruined service signs. The green hologram is trying very hard to get your attention.",
      },
    ],
    hotspots: [
      {
        id: "apollo",
        label: "Flickering projector",
        action: "apollo",
        area: [1, 22, 17, 43],
        kind: "terminal",
      },
      {
        id: "scanner",
        label: "Vion scanner",
        action: "scanner",
        area: [35, 64, 16, 17],
        kind: "item",
        hiddenWhen: "vionScanner",
      },
      {
        id: "coupler",
        label: "Phase coupler",
        action: "coupler",
        area: [57, 59, 14, 18],
        kind: "item",
        hiddenWhen: "phaseCoupler",
      },
      {
        id: "guard",
        label: "Collapsed guard bot",
        action: "guard",
        area: [72, 52, 19, 28],
        kind: "item",
        hiddenWhen: "guardCore",
      },
      {
        id: "protocol",
        label: "Protocol archive",
        action: "protocols",
        area: [18, 17, 19, 25],
        kind: "inspect",
      },
      {
        id: "cryoDoor",
        label: "Red-lit cryo bulkhead",
        action: "go:cryo",
        area: [28, 7, 15, 39],
        kind: "exit",
      },
      {
        id: "serviceGallery",
        label: "Shattered service gallery",
        action: "go:power",
        area: [62, 10, 33, 31],
        kind: "exit",
      },
    ],
  },
  power: {
    id: "power",
    name: "Power Junction",
    sector: "Research Bay 01",
    image: "/assets/rooms/power-junction.png",
    description:
      "Three surviving circuits ask for more power than the old generator can make. A fourth bus is burned clean through.",
    ambience: "GENERATOR OUTPUT 160 N / AUXILIARY BUS OPEN",
    exits: [
      { to: "lab", label: "Experiment Chamber", approach: "Cyan maintenance door", blocked: "" },
      {
        to: "decon",
        label: "Decontamination Hub",
        approach: "Wheel-sealed pressure door",
        condition: "doors",
        blocked: "The pressure door needs the door-motor circuit. Route forty nellons to doors.",
      },
    ],
    hotspots: [
      {
        id: "bus",
        label: "Burned auxiliary bus",
        action: "repairBus",
        area: [49, 19, 20, 39],
        kind: "puzzle",
      },
      {
        id: "routing",
        label: "Power routing console",
        action: "power",
        area: [3, 24, 24, 43],
        kind: "terminal",
      },
      {
        id: "annexFeed",
        label: "Cryo Annex feed",
        action: "annexFeed",
        area: [82, 22, 12, 31],
        kind: "inspect",
      },
      {
        id: "labDoor",
        label: "Cyan maintenance door",
        action: "go:lab",
        area: [18, 25, 14, 31],
        kind: "exit",
      },
      {
        id: "deconDoor",
        label: "Wheel-sealed pressure door",
        action: "go:decon",
        area: [62, 28, 15, 35],
        kind: "exit",
      },
    ],
  },
  decon: {
    id: "decon",
    name: "Decontamination Hub",
    sector: "Research Bay 01",
    image: "/assets/rooms/decontamination-hall.png",
    description:
      "The corridor breathes again. A red sterile bulkhead and a blue crew passage wait beneath signs erased by time.",
    ambience: "PRESSURE NOMINAL / NO ACTIVE PERSONNEL",
    exits: [
      { to: "power", label: "Power Junction", approach: "Maintenance access behind you", blocked: "" },
      { to: "clean", label: "Clean Room", approach: "Red sterile bulkhead", blocked: "" },
      {
        to: "quarters",
        label: "Crew Quarters",
        approach: "Blue crew-wing passage",
        blocked: "",
      },
    ],
    hotspots: [
      {
        id: "status",
        label: "Life-support readout",
        action: "lifeReadout",
        area: [32, 20, 35, 20],
        kind: "terminal",
      },
      {
        id: "sterileDoor",
        label: "Red sterile bulkhead",
        action: "go:clean",
        area: [31, 21, 16, 31],
        kind: "exit",
      },
      {
        id: "route",
        label: "Erased station directory",
        action: "directory",
        area: [50, 22, 16, 25],
        kind: "inspect",
      },
      {
        id: "crewDoor",
        label: "Blue crew-wing passage",
        action: "go:quarters",
        area: [70, 25, 16, 50],
        kind: "exit",
      },
    ],
  },
  clean: {
    id: "clean",
    name: "Clean Room",
    sector: "Research Bay 01",
    image: "/assets/rooms/clean-room.png",
    description:
      "The room is absurdly pristine. Automated air jets still perform their little ritual for an audience of dust.",
    ambience: "STERILITY 81% / MATERIALS CABINET SEALED",
    exits: [
      { to: "decon", label: "Decontamination Hub", approach: "Dark return passage", blocked: "" },
      {
        to: "medical",
        label: "Medical Bay",
        approach: "Sealed treatment bulkhead",
        condition: "cleanClue",
        blocked: "The treatment bulkhead requires one manual sterilization cycle. Watch the air jets.",
      },
    ],
    hotspots: [
      {
        id: "jets",
        label: "Cycling air jets",
        action: "cleanJets",
        area: [17, 19, 27, 30],
        kind: "inspect",
      },
      {
        id: "cabinet",
        label: "Emergency cabinet",
        action: "cleanCabinet",
        area: [70, 18, 21, 38],
        kind: "puzzle",
      },
      {
        id: "bench",
        label: "Sample bench",
        action: "cleanBench",
        area: [35, 49, 36, 31],
        kind: "inspect",
      },
      {
        id: "returnPassage",
        label: "Dark return passage",
        action: "go:decon",
        area: [0, 47, 10, 47],
        kind: "exit",
      },
      {
        id: "treatmentDoor",
        label: "Sealed treatment bulkhead",
        action: "go:medical",
        area: [50, 8, 16, 47],
        kind: "exit",
      },
    ],
  },
  medical: {
    id: "medical",
    name: "Medical Bay",
    sector: "Research Bay 01",
    image: "/assets/rooms/medical-bay.png",
    description:
      "The surgical chair is still aimed at the ceiling. The autoforge waits with the patience of a trap.",
    ambience: "MEDICAL INVENTORY EXPIRED / AUTOFORGE READY",
    exits: [
      { to: "clean", label: "Clean Room", approach: "Cyan-lit sterile door", blocked: "" },
      {
        to: "annex",
        label: "Cryo Annex",
        approach: "Protected red bulkhead",
        condition: "apolloPowered",
        blocked: "The protected cryo bulkhead requires Apollo's identity handshake. Restore his cognition core.",
      },
    ],
    hotspots: [
      {
        id: "forge",
        label: "Suit autoforge",
        action: "forge",
        area: [48, 40, 25, 37],
        kind: "puzzle",
      },
      {
        id: "charger",
        label: "Universal charging cradle",
        action: "charger",
        area: [63, 20, 12, 30],
        kind: "puzzle",
      },
      {
        id: "chair",
        label: "Surgical chair",
        action: "medChair",
        area: [40, 42, 17, 33],
        kind: "inspect",
      },
      {
        id: "records",
        label: "Species records",
        action: "species",
        area: [4, 25, 27, 30],
        kind: "terminal",
      },
      {
        id: "sterileReturn",
        label: "Cyan-lit sterile door",
        action: "go:clean",
        area: [0, 20, 10, 45],
        kind: "exit",
      },
      {
        id: "annexDoor",
        label: "Protected red bulkhead",
        action: "go:annex",
        area: [79, 16, 18, 47],
        kind: "exit",
      },
    ],
  },
  annex: {
    id: "annex",
    name: "Cryo Annex",
    sector: "Research Bay 01",
    image: "/assets/rooms/cryo-annex.png",
    description:
      "Seven blue coffins drink from an isolated power loop. Their occupants are alive in the narrowest possible sense.",
    ambience: "7 VIABLE / REVIVAL FACILITIES UNAVAILABLE",
    exits: [{ to: "medical", label: "Medical Bay", approach: "Red return bulkhead", blocked: "" }],
    hotspots: [
      {
        id: "pods",
        label: "Viable sleepers",
        action: "annexPods",
        area: [4, 17, 67, 56],
        kind: "inspect",
      },
      {
        id: "generator",
        label: "Isolated generator",
        action: "annexGenerator",
        area: [73, 33, 19, 36],
        kind: "terminal",
      },
      {
        id: "names",
        label: "Pod nameplates",
        action: "names",
        area: [22, 66, 38, 16],
        kind: "inspect",
      },
      {
        id: "annexReturn",
        label: "Red return bulkhead",
        action: "go:medical",
        area: [51, 5, 13, 35],
        kind: "exit",
      },
    ],
  },
  quarters: {
    id: "quarters",
    name: "Crew Quarters",
    sector: "Research Bay 01",
    image: "/assets/rooms/crew-quarters.png",
    description:
      "Someone left a paper notebook open beneath a wall of photographs. The bunk across from it was never made.",
    ambience: "OCCUPANCY 0 / PERSONAL ARCHIVE LOCAL",
    exits: [
      { to: "decon", label: "Decontamination Hub", approach: "Left crew passage", blocked: "" },
      {
        to: "mess",
        label: "Mess / Recreation",
        approach: "Central crew bulkhead",
        condition: "miraRead",
        blocked: "The crew bulkhead's manual release is buried in the personal archive. Read Mira's open notebook.",
      },
    ],
    hotspots: [
      {
        id: "notebook",
        label: "Mira's notebook",
        action: "miraLog",
        area: [67, 55, 22, 25],
        kind: "inspect",
      },
      {
        id: "locker",
        label: "Locker 04",
        action: "locker",
        area: [34, 21, 16, 45],
        kind: "puzzle",
      },
      {
        id: "photos",
        label: "Crew photographs",
        action: "photos",
        area: [69, 17, 24, 31],
        kind: "inspect",
      },
      {
        id: "bunk",
        label: "Unmade bunk",
        action: "bunk",
        area: [4, 53, 28, 28],
        kind: "inspect",
      },
      {
        id: "crewReturn",
        label: "Left crew passage",
        action: "go:decon",
        area: [0, 17, 16, 50],
        kind: "exit",
      },
      {
        id: "recDoor",
        label: "Central crew bulkhead",
        action: "go:mess",
        area: [50, 4, 17, 50],
        kind: "exit",
      },
    ],
  },
  mess: {
    id: "mess",
    name: "Mess / Recreation",
    sector: "Research Bay 01",
    image: "/assets/rooms/mess-rec.png",
    description:
      "A blue ocean rolls silently across the recreation wall. No ocean existed on this planet when the image was recorded.",
    ambience: "SIMULATION LOOP 323,991,407 / AUDIO LOST",
    exits: [
      { to: "quarters", label: "Crew Quarters", approach: "Amber return passage", blocked: "" },
      {
        to: "comms",
        label: "Minor Comms",
        approach: "Blue archive doorway",
        condition: "apolloPowered",
        blocked: "The communications archive requires Apollo's identity handshake. Restore his cognition core.",
      },
    ],
    hotspots: [
      {
        id: "projector",
        label: "Recreation projector",
        action: "projector",
        area: [5, 20, 31, 34],
        kind: "item",
        hiddenWhen: "projectorCell",
      },
      {
        id: "game",
        label: "Abandoned table game",
        action: "tableGame",
        area: [18, 55, 39, 28],
        kind: "inspect",
      },
      {
        id: "cups",
        label: "Six cups",
        action: "cups",
        area: [58, 51, 24, 25],
        kind: "inspect",
      },
      {
        id: "quartersReturn",
        label: "Amber return passage",
        action: "go:quarters",
        area: [0, 15, 10, 43],
        kind: "exit",
      },
      {
        id: "commsDoor",
        label: "Blue archive doorway",
        action: "go:comms",
        area: [59, 13, 13, 47],
        kind: "exit",
      },
    ],
  },
  comms: {
    id: "comms",
    name: "Minor Comms",
    sector: "Research Bay 01",
    image: "/assets/rooms/comms-room.png",
    description:
      "A stubborn waveform repeats beneath the static. Through the cracked glass, a dark arc crosses the red sky.",
    ambience: "LOCAL CARRIER DETECTED / SOURCE UNKNOWN",
    exits: [
      { to: "mess", label: "Mess / Recreation", approach: "Cyan archive doorway", blocked: "" },
      {
        to: "exterior",
        label: "Station Exterior",
        approach: "Surface-operations airlock",
        condition: "outsideReady",
        blocked: "The surface airlock needs stable pressure, a sealed suit, and a decoded destination.",
      },
    ],
    hotspots: [
      {
        id: "wave",
        label: "Repeating waveform",
        action: "commsWave",
        area: [31, 30, 27, 31],
        kind: "puzzle",
      },
      {
        id: "window",
        label: "Object in the sky",
        action: "skyObject",
        area: [59, 17, 35, 45],
        kind: "inspect",
      },
      {
        id: "terminal",
        label: "Command traffic",
        action: "oldTraffic",
        area: [2, 22, 20, 42],
        kind: "terminal",
      },
      {
        id: "archiveReturn",
        label: "Cyan archive doorway",
        action: "go:mess",
        area: [16, 11, 17, 49],
        kind: "exit",
      },
      {
        id: "surfaceAirlock",
        label: "Surface-operations airlock",
        action: "airlock",
        area: [90, 43, 10, 43],
        kind: "exit",
      },
    ],
  },
  exterior: {
    id: "exterior",
    name: "Station Exterior",
    sector: "Khepri Basin",
    image: "/assets/rooms/station-exterior.png",
    description:
      "Red dust moves like water around your boots. Above the station, a machine large enough to counterfeit a moon turns without sound.",
    ambience: "EXTERNAL ATMOSPHERE TOXIC / BEACON 22 KM",
    exits: [
      { to: "comms", label: "Minor Comms", approach: "Station airlock", blocked: "" },
      {
        to: "canyon",
        label: "Basalt Canyon",
        approach: "Beacon trail",
        condition: "satelliteScanned",
        blocked: "The beacon path is buried in orbital noise. Scan the wreckage.",
      },
    ],
    hotspots: [
      {
        id: "satellite",
        label: "Smashed survey satellite",
        action: "satellite",
        area: [39, 53, 25, 30],
        kind: "puzzle",
      },
      {
        id: "ring",
        label: "Orbital ring",
        action: "terraformer",
        area: [72, 4, 24, 26],
        kind: "inspect",
      },
      {
        id: "airlock",
        label: "Station airlock",
        action: "go:comms",
        area: [4, 39, 29, 42],
        kind: "exit",
      },
      {
        id: "trail",
        label: "Beacon trail",
        action: "go:canyon",
        area: [64, 57, 32, 30],
        kind: "exit",
      },
    ],
  },
  canyon: {
    id: "canyon",
    name: "Basalt Canyon",
    sector: "Khepri Basin",
    image: "/assets/rooms/basalt-canyon.png",
    description:
      "The sky becomes a white wound. Apollo says the ash front will arrive soon, then politely reminds you that time only advances when you act.",
    ambience: "TERRAFORMER STRIKE 01 / ASH FRONT APPROACHING",
    exits: [
      { to: "exterior", label: "Station Exterior", approach: "Station trail behind you", blocked: "" },
      {
        to: "rover",
        label: "Khepri-6 Basin",
        approach: "Canyon floor beyond the ash",
        condition: "sheltered",
        blocked: "The ash front is crossing the canyon. Find sound shelter.",
      },
    ],
    hotspots: [
      {
        id: "overhang",
        label: "Shallow overhang",
        action: "overhang",
        area: [1, 42, 35, 34],
        kind: "inspect",
      },
      {
        id: "marker",
        label: "Survey marker",
        action: "marker",
        area: [47, 48, 13, 30],
        kind: "inspect",
      },
      {
        id: "tube",
        label: "Glassy lava tube",
        action: "lavaTube",
        area: [71, 45, 24, 31],
        kind: "puzzle",
      },
      {
        id: "roverTrail",
        label: "Canyon floor beyond the ash",
        action: "go:rover",
        area: [39, 74, 28, 22],
        kind: "exit",
      },
    ],
  },
  rover: {
    id: "rover",
    name: "Cargo Rover Khepri-6",
    sector: "Eastern Basin",
    image: "/assets/rooms/cargo-rover.png",
    description:
      "The rover never reached its ship. It became a house, then a monument, then only a coordinate that refused to die.",
    ambience: "BEACON LOCAL / MAIN DRIVE IRRECOVERABLE",
    exits: [
      { to: "canyon", label: "Basalt Canyon", approach: "Canyon trail", blocked: "" },
      {
        to: "uplink",
        label: "Rover Command Cabin",
        approach: "Open rover hatch",
        condition: "antennaFixed",
        blocked: "The cabin opens, but its uplink is blind. Repair the roof antenna first.",
      },
    ],
    hotspots: [
      {
        id: "antenna",
        label: "Empty antenna housing",
        action: "antenna",
        area: [48, 16, 18, 28],
        kind: "puzzle",
      },
      {
        id: "case",
        label: "Half-buried supply case",
        action: "roverCase",
        area: [69, 73, 20, 18],
        kind: "item",
        hiddenWhen: "roverCell",
      },
      {
        id: "markers",
        label: "Burial markers",
        action: "burials",
        area: [2, 39, 18, 30],
        kind: "inspect",
      },
      {
        id: "hatch",
        label: "Open rover hatch",
        action: "go:uplink",
        area: [57, 49, 17, 25],
        kind: "exit",
      },
    ],
  },
  uplink: {
    id: "uplink",
    name: "Rover Command Cabin",
    sector: "Khepri-6",
    image: "/assets/rooms/rover-uplink.png",
    description:
      "The terraformer fills the broken windshield. Three sockets wait beneath a console designed to ask a dead civilization for permission.",
    ambience: "REMOTE AUTHORITY POSSIBLE / ONE TRANSMISSION",
    exits: [{ to: "rover", label: "Rover Exterior", approach: "Cabin hatch", blocked: "" }],
    hotspots: [
      {
        id: "apollo",
        label: "Apollo",
        action: "finalApollo",
        area: [6, 34, 17, 30],
        kind: "terminal",
      },
      {
        id: "sensor",
        label: "Sensor socket",
        action: "socket:sensor",
        area: [31, 48, 10, 17],
        kind: "puzzle",
      },
      {
        id: "logic",
        label: "Logic socket",
        action: "socket:logic",
        area: [41, 48, 10, 17],
        kind: "puzzle",
      },
      {
        id: "power",
        label: "Uplink socket",
        action: "socket:power",
        area: [51, 48, 10, 17],
        kind: "puzzle",
      },
      {
        id: "wave",
        label: "Authorization console",
        action: "finalConsole",
        area: [61, 45, 13, 22],
        kind: "terminal",
      },
      {
        id: "lever",
        label: "Emergency transmission lever",
        action: "lever",
        area: [76, 42, 15, 30],
        kind: "puzzle",
      },
    ],
  },
};

export function newGame(): GameState {
  return {
    version: 3,
    started: false,
    currentRoom: "cryo",
    inventory: [],
    selectedItem: null,
    flags: [],
    notes: [],
    powerRoutes: [],
    interactions: 0,
    roomsVisited: ["cryo"],
    scanCharges: 4,
    signalTrace: 0,
    lastMessage: "Action advances the story. Nothing happens while you wait.",
    ending: false,
  };
}

export function hasFlag(state: GameState, flag: string): boolean {
  return state.flags.includes(flag);
}

export function hasItem(state: GameState, item: string): boolean {
  return state.inventory.includes(item);
}

function withFlag(state: GameState, flag: string): GameState {
  return hasFlag(state, flag) ? state : { ...state, flags: [...state.flags, flag] };
}

function withoutItem(state: GameState, item: string): GameState {
  return { ...state, inventory: state.inventory.filter((id) => id !== item) };
}

function withItem(state: GameState, item: string): GameState {
  return hasItem(state, item) ? state : { ...state, inventory: [...state.inventory, item] };
}

function withNote(state: GameState, note: string): GameState {
  return state.notes.includes(note) ? state : { ...state, notes: [...state.notes, note] };
}

function message(state: GameState, lastMessage: string): GameState {
  return { ...state, lastMessage, interactions: state.interactions + 1 };
}

function selectCleared(state: GameState): GameState {
  return { ...state, selectedItem: null };
}

function outcome(state: GameState, lastMessage: string, extra?: Partial<Outcome>): Outcome {
  return { state: message(selectCleared(state), lastMessage), ...extra };
}

function inspect(state: GameState, lastMessage: string, dialogue?: Dialogue): Outcome {
  return outcome(state, lastMessage, dialogue ? { dialogue } : undefined);
}

export function canUseExit(state: GameState, exit: Exit): boolean {
  return !exit.condition || hasFlag(state, exit.condition);
}

export function visibleHotspots(state: GameState, room: Room): Hotspot[] {
  return room.hotspots.filter((hotspot) => {
    if (!hotspot.hiddenWhen) return true;
    return !hasItem(state, hotspot.hiddenWhen) && !hasFlag(state, hotspot.hiddenWhen);
  });
}

export function moveTo(state: GameState, to: RoomId): Outcome {
  const exit = rooms[state.currentRoom].exits.find((candidate) => candidate.to === to);
  if (!exit) {
    return inspect(state, "There is no direct route from here. Follow the visible bulkheads or retrace your path.");
  }
  if (!canUseExit(state, exit)) return inspect(state, exit.blocked);

  let next = state;
  if (!next.roomsVisited.includes(to)) next = { ...next, roomsVisited: [...next.roomsVisited, to] };
  next = { ...next, currentRoom: to, selectedItem: null };
  if (hasFlag(next, "apolloPowered") && next.signalTrace > 0) {
    next = { ...next, signalTrace: next.signalTrace - 1 };
  }

  if (to === "canyon" && !hasFlag(next, "laserSeen")) {
    next = withFlag(next, "laserSeen");
    return outcome(next, rooms[to].description, {
      dialogue: {
        speaker: "APOLLO",
        title: "RED TRANSCENDENCE 2.9",
        portrait: "apollo",
        lines: [
          "That was not a weapon discharge. It was an atmosphere-conversion bore.",
          "The terraformer has begun its default mission-failure protocol. This planet is being made ready for people who died eight hundred million years ago.",
          "The ash front will wait for your next action. We should choose shelter by evidence, not speed.",
        ],
      },
    });
  }

  return outcome(next, rooms[to].description);
}

export function consumeLocalScan(state: GameState): Outcome {
  if (state.scanCharges <= 0) {
    return inspect(
      state,
      "The local scanner clicks dry. Search by eye, or recharge its pulse capacitor in Medical.",
    );
  }

  const signalTrace = Math.min(3, state.signalTrace + 1);
  let next: GameState = {
    ...state,
    scanCharges: state.scanCharges - 1,
    signalTrace,
  };

  if (signalTrace === 3) next = withFlag(next, "proximityAlarm");

  const report =
    signalTrace === 1
      ? "Local scan emitted. One capacitor charge spent. Something beyond the station noticed the carrier."
      : signalTrace === 2
        ? "Local scan emitted. The return contains a second signal that is not yours."
        : "PROXIMITY ALARM: your scan has been triangulated. The station is now broadcasting its location.";

  return outcome(next, report);
}

function addLoot(state: GameState, item: string, lastMessage: string): Outcome {
  return outcome(withItem(withFlag(state, item), item), lastMessage);
}

export function interact(state: GameState, action: string): Outcome {
  if (action.startsWith("go:")) return moveTo(state, action.slice(3) as RoomId);

  switch (action) {
    case "wake": {
      if (hasFlag(state, "awake")) {
        return inspect(state, "The pod is empty except for a human-shaped absence in the frost.");
      }
      const next = withFlag(state, "awake");
      return outcome(next, "Motor control returns in painful pieces.", {
        dialogue: {
          speaker: "SUIT RECORDER",
          title: "REVIVAL EXCEPTION",
          portrait: "system",
          lines: [
            "Cryostasis cycle ended without medical supervision.",
            "Crew identity checksum: unavailable. Local life-support reserve: forty-three minutes.",
            "This is not a countdown. The reserve changes only when you commit an action.",
          ],
        },
      });
    }
    case "clock": {
      const next = withNote(withFlag(state, "timeKnown"), "clock");
      return outcome(next, "The chronometer insists it has not malfunctioned.", {
        dialogue: {
          speaker: "LOCAL CHRONOMETER",
          title: "ELAPSED TIME",
          portrait: "system",
          lines: [
            "887,842,500 years.",
            "7 months. 1 day. 6 hours. 42 minutes. 23 seconds.",
            "Arithmetic verification: PASS.",
          ],
        },
      });
    }
    case "cryoSleepers":
      return inspect(
        state,
        "Two shapes remain behind blue frost. Their pod lights pulse too slowly to be comforting.",
      );
    case "apollo": {
      const first = !hasFlag(state, "apolloMet");
      const next = withFlag(state, "apolloMet");
      return outcome(next, first ? "The projector spends its last charge on a smile." : "Apollo resolves into three green scanlines.", {
        dialogue: {
          speaker: "APOLLO",
          title: first ? "ASSISTANT PROCESS / 3% COGNITION" : "ASSISTANT PROCESS",
          portrait: "apollo",
          lines: first
            ? [
                "Doctors? Wonderful. You are extremely late.",
                "I am Apollo, laboratory assistant. My higher reasoning is currently somewhere between unavailable and on fire.",
                "The power junction is through the shattered service gallery. Life support needs one hundred twenty nellons; door motors need forty.",
                "I can help—properly—if you repair the auxiliary bus and spare sixty more.",
              ]
            : [
                hasFlag(state, "apolloPowered")
                  ? "Cognition stable. I remember being less lonely than this."
                  : "Three percent cognition. Enough for courtesy, insufficient for miracles.",
                getHint(state),
              ],
        },
      });
    }
    case "scanner":
      return addLoot(
        state,
        "vionScanner",
        "You take the Vion scanner. It rises one centimeter, thinks better of it, and falls into your hand.",
      );
    case "coupler":
      return addLoot(
        state,
        "phaseCoupler",
        "The phase coupler is warm. In a room this cold, that counts as optimism.",
      );
    case "guard":
      return addLoot(
        state,
        "guardCore",
        "“ENGAGING DEFENSE—” The guard bot folds in half. Its logic core is still intact.",
      );
    case "protocols": {
      const next = withNote(withFlag(state, "protocolsKnown"), "protocols");
      return outcome(next, "Most of the archive is static. Three protocol names survive.");
    }
    case "repairBus": {
      if (hasFlag(state, "busRepaired")) {
        return inspect(state, "The improvised bridge holds. Generator capacity: two hundred twenty nellons.");
      }
      if (state.selectedItem !== "phaseCoupler") {
        return inspect(
          state,
          hasItem(state, "phaseCoupler")
            ? "The gap matches the phase coupler in your inventory. Select it, then use it here."
            : "The auxiliary bus needs a phase-matched bridge. The lab benches might still have one.",
        );
      }
      let next = withoutItem(state, "phaseCoupler");
      next = withFlag(next, "busRepaired");
      return outcome(next, "The coupler flashes white. Auxiliary capacity rises from 160 to 220 nellons.", {
        dialogue: {
          speaker: "APOLLO",
          portrait: "apollo",
          lines: [
            "That gives us enough for lungs, doors, and me.",
            "I appreciate being third on that list. It is the correct position.",
          ],
        },
      });
    }
    case "power":
      return { state: message(state, "Power changes are latched only when you commit the routing plan."), modal: "power" };
    case "annexFeed":
      return inspect(
        state,
        "An isolated eighty-nellon line feeds the Cryo Annex. The breaker is physically tagged: LIVING LOAD—DO NOT DIVERT.",
      );
    case "lifeReadout":
      return inspect(
        state,
        hasFlag(state, "life")
          ? "Oxygen stable. Toxins falling. The station has stopped trying to become a tomb."
          : "Minimum safe life support requires 120 nellons. The reserve will not decrease while you think.",
      );
    case "directory":
      return inspect(
        state,
        "Most labels are gone. Two routes answer: a sterile wing under red lamps and a crew wing under blue. Surface operations lies somewhere beyond the crew wing.",
      );
    case "airlock": {
      if (hasFlag(state, "outsideReady")) return moveTo(state, "exterior");
      const missing: string[] = [];
      if (!hasFlag(state, "beaconDecoded")) missing.push("a decoded destination");
      if (!hasItem(state, "exoSuit")) missing.push("a sealed suit");
      if (!hasFlag(state, "life")) missing.push("stable pressure");
      return inspect(state, `The airlock interlock still needs ${missing.join(", ")}.`);
    }
    case "cleanJets": {
      const next = withNote(withFlag(state, "cleanClue"), "cleanCycle");
      return outcome(
        next,
        "The jets fire cyan, amber, cyan. The cabinet valves answer—and the treatment bulkhead releases its sterile interlock.",
      );
    }
    case "cleanCabinet":
      if (hasItem(state, "bioseal") || hasFlag(state, "bioseal")) {
        return inspect(state, "The emergency cabinet is empty. Its three valve lamps are finally dark.");
      }
      return { state: message(state, "The cabinet expects the room's three-step sterilization cycle."), modal: "clean" };
    case "cleanBench":
      return inspect(
        state,
        "Nothing living remains in the sample trays. Apollo calls that scientifically inconclusive, then apologizes.",
      );
    case "forge": {
      if (hasItem(state, "exoSuit")) {
        return inspect(state, "The repaired Zeta suit hangs sealed and ready.");
      }
      if (!hasItem(state, "exoHarness") || !hasItem(state, "bioseal")) {
        return inspect(
          state,
          "The autoforge can repair a Zeta harness with pressure-reactive bioseal. You do not have both components.",
        );
      }
      let next = withoutItem(withoutItem(state, "exoHarness"), "bioseal");
      next = withItem(withFlag(next, "suitRepaired"), "exoSuit");
      return outcome(next, "The autoforge laminates the tear one square millimeter at a time. The Zeta suit seals green.");
    }
    case "charger": {
      if (hasItem(state, "chargedScanner")) {
        if (state.scanCharges < 6) {
          return outcome(
            { ...state, scanCharges: Math.min(6, state.scanCharges + 2) },
            "The cradle transfers two cautious pulses into the local scan capacitor.",
          );
        }
        return inspect(state, "The Vion scanner hums above its empty cradle. The local capacitor is already full.");
      }
      if (!hasItem(state, "vionScanner") || !hasItem(state, "projectorCell")) {
        return inspect(
          state,
          "The universal cradle can mate a compact power cell to an analysis tool. Both sockets are empty.",
        );
      }
      let next = withoutItem(withoutItem(state, "vionScanner"), "projectorCell");
      next = withItem(withFlag(next, "scannerCharged"), "chargedScanner");
      next = { ...next, scanCharges: Math.min(6, next.scanCharges + 3) };
      return outcome(next, "The Vion scanner wakes, unfolds, and begins quietly measuring your skeleton.");
    }
    case "medChair":
      return inspect(state, "The restraints are closed. You decide not to discover why.");
    case "species":
      return inspect(
        state,
        "The records list Sapien, Krogg, Chimbo, and twelve species with no surviving translation. All were crew.",
      );
    case "annexPods": {
      const next = withNote(withFlag(state, "sleepersKnown"), "sleepers");
      return outcome(next, "Seven heart traces. Fragile, real, and impossibly patient.", {
        dialogue: {
          speaker: "APOLLO",
          portrait: "apollo",
          lines: [
            "Their generator could power me for years.",
            "It would also kill them. I have marked that as a poor solution.",
          ],
        },
      });
    }
    case "annexGenerator":
      return inspect(
        state,
        "The manual disconnect is accessible. Apollo has placed a green NO beside it, using almost none of his remaining power.",
      );
    case "names":
      return inspect(state, "Seven names from four species. Someone polished each plate before the long sleep.");
    case "miraLog": {
      let next = withNote(state, "mira");
      next = withNote(withFlag(next, "miraRead"), "doctrine");
      return outcome(next, "Mira's last log ends mid-sentence. A penciled manual release opens the recreation passage.", {
        dialogue: {
          speaker: "MIRA VALE / PERSONAL LOG",
          title: "DAY 14",
          portrait: "crew",
          lines: [
            "Sayeed put the surviving Zeta harness in locker 04. Same emergency pin: launch month and day, 07/14.",
            "The rover beacon is still calling. Long, short, short, long.",
            "If we reach the uplink: locate, then listen, then hold. The terraformer doctrine was written in that order for a reason.",
          ],
        },
      });
    }
    case "locker":
      if (hasItem(state, "exoHarness") || hasFlag(state, "lockerOpen")) {
        return inspect(state, "Locker 04 stands open. A faded launch-day ribbon is tied around the handle.");
      }
      return { state: message(state, "Four digits. The keys are worn, but not enough to guess."), modal: "keypad" };
    case "photos":
      return inspect(
        state,
        "Launch day: 07/14. Mira, Sayeed, six others, and a fuzzy green Apollo projection crowd the frame.",
      );
    case "bunk":
      return inspect(state, "A boot waits beneath the bunk. Its matching boot is still beside your cryopod.");
    case "projector": {
      let next = withItem(withFlag(state, "projectorCell"), "projectorCell");
      return outcome(next, "You silence the ancient ocean and recover the projector's isolated power cell.");
    }
    case "tableGame":
      return inspect(state, "The final move is illegal in every ruleset Apollo can remember.");
    case "cups":
      return inspect(state, "Six cups. Six mineral rings. Nobody expected the last meal to be the last.");
    case "commsWave": {
      if (!hasFlag(state, "apolloPowered")) {
        return inspect(state, "The waveform is buried under eight hundred million years of noise. Apollo needs full cognition.");
      }
      if (!hasItem(state, "chargedScanner")) {
        return inspect(state, "Apollo can hear the carrier but cannot isolate it. A working field scanner could strip the noise.");
      }
      if (hasFlag(state, "beaconDecoded")) {
        return inspect(state, "Cargo Rover Khepri-6. Twenty-two kilometers. The beacon is still waiting.");
      }
      return { state: message(state, "The decoder needs the four-pulse signature recorded by the missing crew."), modal: "comms" };
    }
    case "skyObject":
      return inspect(
        withFlag(state, "ringSeen"),
        "The arc is too regular to be a moon. It is moving against the stars.",
      );
    case "oldTraffic":
      return inspect(
        state,
        "The last command packet asks Research Bay One to report repairs. It has been retrying since before mammals existed.",
      );
    case "satellite": {
      if (hasFlag(state, "satelliteScanned")) {
        return inspect(state, "The satellite's empty lens cradle points toward the canyon and Khepri-6.");
      }
      if (state.selectedItem !== "chargedScanner") {
        return inspect(
          state,
          hasItem(state, "chargedScanner")
            ? "The wreck broadcasts no readable telemetry. Select the Vion scanner and sweep it."
            : "The satellite is fused shut by radiation and time.",
        );
      }
      let next = withItem(state, "cobaltLens");
      next = withNote(withFlag(next, "satelliteScanned"), "orbitalMap");
      return outcome(next, "The scanner peels a cobalt lens from its cradle and reconstructs the dead satellite's final map.", {
        dialogue: {
          speaker: "APOLLO",
          title: "ORBITAL BODY IDENTIFIED",
          portrait: "apollo",
          lines: [
            "Red Transcendence terraformer. Mission-failure protocol active.",
            "It arrived recently. Its gravity woke you. Its first strike made the storm.",
            "Khepri-6 lies beyond a hollow basalt seam. The scanner will recognize the safe shelter.",
          ],
        },
      });
    }
    case "terraformer":
      return inspect(
        withFlag(state, "ringSeen"),
        "A ring around a blade around a furnace. This is what shook you awake.",
      );
    case "overhang":
      return inspect(
        state,
        "The scanner paints the overhang red: fresh fractures, shallow cover, nowhere for the pressure wave to go.",
      );
    case "marker":
      return inspect(
        state,
        "The survey marker points at the lava tube. Its old cobalt inlay matches the scanner's safe-return blue.",
      );
    case "lavaTube": {
      if (!hasItem(state, "chargedScanner")) {
        return inspect(state, "The tunnel is deep and absolutely black. You need evidence before trusting it.");
      }
      const next = withFlag(state, "sheltered");
      return outcome(next, "You wait inside the glassy seam. The storm passes only when you choose to emerge.", {
        dialogue: {
          speaker: "APOLLO",
          portrait: "apollo",
          lines: [
            "Outside, several million tons of your former workplace are becoming weather.",
            "The rover beacon survived.",
            "So did the seven sleepers. The isolated circuit held.",
          ],
        },
      });
    }
    case "antenna": {
      if (hasFlag(state, "antennaFixed")) {
        return inspect(state, "The cobalt lens tracks the terraformer. The uplink has one clean line of sight.");
      }
      if (state.selectedItem !== "cobaltLens") {
        return inspect(
          state,
          hasItem(state, "cobaltLens")
            ? "The empty housing fits the satellite lens. Select the lens, then install it."
            : "The focusing lens is gone. A survey satellite used the same antenna standard.",
        );
      }
      const next = withoutItem(withFlag(state, "antennaFixed"), "cobaltLens");
      return outcome(next, "The cobalt lens clicks into place. The rover turns one last machine toward the sky.");
    }
    case "roverCase":
      return addLoot(state, "roverCell", "The case contains one reserve cell with ten nellons and a handwritten label: FOR THE CALL.");
    case "burials": {
      const next = withNote(withFlag(state, "burialsRead"), "roverCrew");
      return outcome(next, "Six markers face the station. The seventh space was left open.", {
        dialogue: {
          speaker: "APOLLO",
          portrait: "apollo",
          lines: [
            "I remember their names now.",
            "They reached the rover. They did not reach the ship.",
            "They kept the beacon alive for whoever woke next.",
          ],
        },
      });
    }
    case "finalApollo":
      return inspect(state, "Apollo's projection is almost steady.", {
        speaker: "APOLLO",
        portrait: "apollo",
        lines: [
          "Three sockets: perception, judgment, and power.",
          "The scanner can let the rover perceive. The guard core can let it decide. The reserve cell can let it speak.",
          hasFlag(state, "finalAuthorized")
            ? "The command is assembled. Pull the brass lever when you are ready."
            : "Then we teach the terraformer the order its makers intended.",
        ],
      });
    case "socket:sensor":
      return insertSocket(state, "sensor", "chargedScanner", "The Vion scanner locks into the perception bus.");
    case "socket:logic":
      return insertSocket(state, "logic", "guardCore", "The guard-bot core wakes inside a machine it was never built to understand.");
    case "socket:power":
      return insertSocket(state, "uplinkPower", "roverCell", "Ten nellons enter the transmitter. The brass lever unlocks.");
    case "finalConsole": {
      if (!hasFlag(state, "sensor") || !hasFlag(state, "logic") || !hasFlag(state, "uplinkPower")) {
        return inspect(state, "The authorization console needs perception, judgment, and uplink power.");
      }
      if (hasFlag(state, "finalAuthorized")) {
        return inspect(state, "Sequence ready: Mapping 317 → Biosphere Witness → Red Transcendence safe hold.");
      }
      return { state: message(state, "Three surviving protocols. Apollo needs the doctrine's intended order."), modal: "final" };
    }
    case "lever": {
      if (!hasFlag(state, "finalAuthorized")) {
        return inspect(state, "The lever is mechanically unlocked, but no valid command waits behind it.");
      }
      const next = withFlag({ ...state, ending: true }, "complete");
      return outcome(next, "The terraformer receives a living witness.");
    }
    default:
      return inspect(state, "Nothing useful happens.");
  }
}

function insertSocket(state: GameState, flag: string, requiredItem: string, success: string): Outcome {
  if (hasFlag(state, flag)) return inspect(state, "The socket is live.");
  if (state.selectedItem !== requiredItem) {
    const expected =
      requiredItem === "chargedScanner"
        ? "a working field sensor"
        : requiredItem === "guardCore"
          ? "an inference lattice"
          : "a compact reserve cell";
    return inspect(
      state,
      hasItem(state, requiredItem)
        ? `Select ${items[requiredItem].name}, then place it here.`
        : `The socket expects ${expected}.`,
    );
  }
  let next = withoutItem(state, requiredItem);
  next = withFlag(next, flag);
  return outcome(next, success);
}

export function commitPower(state: GameState, selected: CircuitId[]): Outcome {
  const capacity = hasFlag(state, "busRepaired") ? 220 : 160;
  const used = selected.reduce((sum, id) => sum + circuits[id].cost, 0);
  if (used > capacity) return inspect(state, `Routing rejected: ${used} nellons requested, ${capacity} available.`);

  let next = { ...state, powerRoutes: selected };
  for (const circuit of ["life", "doors", "apollo"] as CircuitId[]) {
    next = selected.includes(circuit) ? withFlag(next, circuit) : next;
  }
  if (selected.includes("apollo")) {
    next = withFlag(next, "apolloPowered");
    if (next.signalTrace >= 3) {
      next = { ...next, signalTrace: 1 };
      next = withFlag(next, "alarmDamped");
    }
  }
  if (selected.includes("life") && selected.includes("doors")) next = withFlag(next, "stationOpen");

  const names = selected.map((id) => circuits[id].name.toLowerCase()).join(", ");
  const dialogue =
    selected.includes("apollo") && !hasFlag(state, "apolloPowered")
      ? {
          speaker: "APOLLO",
          title: "COGNITION RESTORED",
          portrait: "apollo" as const,
          lines: [
            "Oh.",
            "There I am.",
            "I can hear a local signal beneath the static. Find me a working scanner and the pulse key; I will tell you who is calling.",
          ],
        }
      : undefined;
  return outcome(next, `Power latched: ${names || "no active circuits"}. ${used}/${capacity} nellons committed.`, { dialogue });
}

export function solveClean(state: GameState, sequence: string[]): Outcome {
  const correct = sequence.join("-") === "cyan-amber-cyan";
  if (!correct) return inspect(state, "The cabinet coughs sterile dust and resets its valves.");
  let next = withItem(withFlag(state, "bioseal"), "bioseal");
  return outcome(next, "Cyan, amber, cyan. The cabinet extrudes a sealed packet of aerogel bioseal.");
}

export function solveKeypad(state: GameState, code: string): Outcome {
  if (code !== "0714") return inspect(state, "Locker 04 rejects the date.");
  let next = withItem(withFlag(state, "lockerOpen"), "exoHarness");
  return outcome(next, "Locker 04 opens. The damaged Zeta harness inside still carries Sayeed's name.");
}

export function solveComms(state: GameState, pulses: ("short" | "long")[]): Outcome {
  if (pulses.join("-") !== "long-short-short-long") {
    return inspect(state, "The filter collapses into static. The four-pulse key is recorded somewhere personal.");
  }
  let next = withFlag(state, "beaconDecoded");
  next = withNote(next, "beacon");
  if (hasItem(next, "exoSuit") && hasFlag(next, "life")) next = withFlag(next, "outsideReady");
  return outcome(next, "LONG—SHORT—SHORT—LONG. The static resolves into a local navigation beacon.", {
    dialogue: {
      speaker: "APOLLO",
      title: "CARGO ROVER KHEPRI-6",
      portrait: "apollo",
      lines: [
        "Not rescue. A rover, twenty-two kilometers east.",
        "Its crew departed this station after supply ships stopped coming. They were searching for an off-world vessel.",
        "The beacon carries a path through the storm. With a sealed suit, we can follow it.",
      ],
    },
  });
}

export function solveFinal(state: GameState, sequence: string[]): Outcome {
  if (sequence.join("-") !== "map-witness-hold") {
    return inspect(state, "Authorization order rejected. Locate before listen; listen before hold.");
  }
  const next = withFlag(state, "finalAuthorized");
  return outcome(next, "Mapping 317 → Biosphere Witness → Red Transcendence safe hold.", {
    dialogue: {
      speaker: "APOLLO",
      title: "LIVING WITNESS READY",
      portrait: "apollo",
      lines: [
        "The terraformer can see you now.",
        "Not a failed mission. Not an empty world. One living witness and seven sleeping ones.",
        "Pull the lever.",
      ],
    },
  });
}

export function refreshDerivedFlags(state: GameState): GameState {
  let next = state;
  if (hasItem(next, "exoSuit") && hasFlag(next, "beaconDecoded") && hasFlag(next, "life")) {
    next = withFlag(next, "outsideReady");
  }
  return next;
}

export function getObjective(state: GameState): string {
  if (!hasFlag(state, "awake")) return "Orient yourself after the failed revival.";
  if (!hasFlag(state, "stationOpen")) return "Restore life support and release the internal doors.";
  if (!hasFlag(state, "apolloPowered")) return "Divert sixty nellons to Apollo's cognition core.";
  if (hasFlag(state, "antennaFixed")) {
    if (!hasFlag(state, "sensor") || !hasFlag(state, "logic") || !hasFlag(state, "uplinkPower")) {
      return "Give the rover perception, judgment, and transmission power.";
    }
    if (!hasFlag(state, "finalAuthorized")) return "Reconstruct Red Transcendence's safe-hold doctrine.";
    if (!state.ending) return "Transmit the living-witness command.";
    return "The terraformer is holding.";
  }
  if (!hasItem(state, "exoSuit")) return "Find and repair a sealed Zeta exosuit.";
  if (!hasItem(state, "chargedScanner")) return "Restore power to the Vion field scanner.";
  if (!hasFlag(state, "beaconDecoded")) return "Decode the repeating signal in Minor Comms.";
  if (!hasFlag(state, "outsideReady")) return "Prepare the airlock for exterior travel.";
  if (!hasFlag(state, "satelliteScanned")) return "Scan the smashed survey satellite.";
  if (!hasFlag(state, "sheltered")) return "Choose sound shelter from the terraformer storm.";
  if (!hasFlag(state, "antennaFixed")) return "Restore the Cargo Rover's roof antenna.";
  return "Enter the Cargo Rover's command cabin.";
}

export function getHint(state: GameState): string {
  if (!hasFlag(state, "awake")) return "Your open cryopod is still running a recovery diagnostic.";
  if (!hasFlag(state, "apolloMet")) return "The broken laboratory projector has a reserve spark.";
  if (!hasFlag(state, "life") || !hasFlag(state, "doors")) return "The Power Junction must feed lungs and doors before the station opens.";
  if (!hasFlag(state, "busRepaired")) return "A phase coupler from the lab can bridge the burned auxiliary bus.";
  if (!hasFlag(state, "apolloPowered")) return "The repaired bus has exactly enough spare capacity for my cognition core.";
  if (hasFlag(state, "antennaFixed")) {
    if (!hasFlag(state, "sensor")) return "The Vion scanner belongs in the perception socket.";
    if (!hasFlag(state, "logic")) return "The guard-bot core can serve as the rover's judgment lattice.";
    if (!hasFlag(state, "uplinkPower")) return "The supply case was labeled FOR THE CALL.";
    if (!hasFlag(state, "finalAuthorized")) return "Locate, then listen, then hold.";
    return "The brass lever is waiting.";
  }
  if (!hasItem(state, "bioseal") && !hasFlag(state, "bioseal")) return "Watch the Clean Room air jets, then repeat their colors at the cabinet.";
  if (!hasItem(state, "exoHarness") && !hasFlag(state, "lockerOpen")) return "Mira wrote Locker 04's pin in her personal log.";
  if (!hasItem(state, "exoSuit")) return "Medical's autoforge needs the damaged harness and the bioseal.";
  if (!hasItem(state, "projectorCell") && !hasItem(state, "chargedScanner")) {
    return "The recreation projector has been wasting a perfectly good isolated power cell.";
  }
  if (!hasItem(state, "chargedScanner")) return "Medical has a universal charging cradle.";
  if (!hasFlag(state, "beaconDecoded")) return "Mira recorded the carrier's four-pulse key.";
  if (!hasFlag(state, "satelliteScanned")) return "Select the charged scanner, then sweep the smashed satellite.";
  if (!hasFlag(state, "sheltered")) return "Blue scanner returns mark structurally sound basalt.";
  if (!hasFlag(state, "antennaFixed")) return "The satellite's cobalt lens fits the rover's empty antenna housing.";
  return "The rover's open hatch leads to its command cabin.";
}

export function inspectItem(state: GameState, itemId: string): GameState {
  const item = items[itemId];
  return item ? message({ ...state, selectedItem: itemId }, item.description) : state;
}

export const navOrder: RoomId[] = [
  "cryo",
  "lab",
  "power",
  "decon",
  "clean",
  "medical",
  "annex",
  "quarters",
  "mess",
  "comms",
  "exterior",
  "canyon",
  "rover",
  "uplink",
];

export function roomUnlocked(state: GameState, room: RoomId): boolean {
  if (state.roomsVisited.includes(room)) return true;
  if (room === "clean" || room === "quarters") return hasFlag(state, "doors");
  if (room === "medical") return hasFlag(state, "cleanClue");
  if (room === "annex") return hasFlag(state, "apolloPowered");
  if (room === "mess") return hasFlag(state, "miraRead");
  if (room === "comms") return hasFlag(state, "apolloPowered");
  if (room === "decon") return hasFlag(state, "doors");
  if (room === "exterior") return hasFlag(state, "outsideReady");
  if (room === "canyon") return hasFlag(state, "satelliteScanned");
  if (room === "rover") return hasFlag(state, "sheltered");
  if (room === "uplink") return hasFlag(state, "antennaFixed");
  if (room === "lab") return hasFlag(state, "awake");
  if (room === "power") return hasFlag(state, "apolloMet");
  return room === "cryo";
}

export function regionFor(room: RoomId): "station" | "surface" {
  return ["exterior", "canyon", "rover", "uplink"].includes(room) ? "surface" : "station";
}
