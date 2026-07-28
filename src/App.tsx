import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PixelScene from "./components/PixelScene";
import {
  circuits,
  canUseExit,
  commitPower,
  consumeLocalScan,
  getHint,
  getObjective,
  hasFlag,
  inspectItem,
  interact,
  items,
  moveTo,
  navOrder,
  newGame,
  noteLibrary,
  refreshDerivedFlags,
  regionFor,
  rooms,
  solveClean,
  solveComms,
  solveFinal,
  solveKeypad,
  visibleHotspots,
  type CircuitId,
  type Dialogue,
  type GameState,
  type Hotspot,
  type ModalId,
  type Outcome,
  type RoomId,
} from "./game/adventure";

const SAVE_KEY = "crash-site-save-v2";

function loadGame(): GameState {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return newGame();
    const parsed = JSON.parse(raw) as GameState | (Omit<GameState, "version" | "scanCharges" | "signalTrace"> & { version: 2 });
    if (parsed.version === 3) return parsed as GameState;
    if (parsed.version === 2) {
      return {
        ...parsed,
        version: 3,
        scanCharges: parsed.inventory.includes("chargedScanner") ? 6 : 4,
        signalTrace: 0,
      };
    }
    return newGame();
  } catch {
    return newGame();
  }
}

function App() {
  const [state, setState] = useState<GameState>(loadGame);
  const [modal, setModal] = useState<ModalId | "notes" | "help" | null>(null);
  const [dialogue, setDialogue] = useState<Dialogue | null>(null);
  const [reveal, setReveal] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [titleMode, setTitleMode] = useState(!state.started);
  const audioRef = useRef<AudioContext | null>(null);
  const ambientStopRef = useRef<(() => void) | null>(null);
  const scanTimerRef = useRef<number | null>(null);

  const room = rooms[state.currentRoom];
  const ambience =
    state.currentRoom === "power" && hasFlag(state, "busRepaired")
      ? "GENERATOR OUTPUT 220 N / AUXILIARY BUS ONLINE"
      : state.currentRoom === "clean" && hasFlag(state, "bioseal")
        ? "STERILITY 81% / MATERIALS CABINET OPEN"
        : state.currentRoom === "comms" && hasFlag(state, "beaconDecoded")
          ? "LOCAL CARRIER LOCKED / KHEPRI-6"
          : state.currentRoom === "canyon" && hasFlag(state, "sheltered")
            ? "ASH FRONT PASSED / BASALT SEAM STABLE"
            : room.ambience;
  const hotspots = useMemo(() => visibleHotspots(state, room), [state, room]);
  const objective = getObjective(state);
  const capacity = hasFlag(state, "busRepaired") ? 220 : 160;
  const usedPower = state.powerRoutes.reduce((sum, id) => sum + circuits[id].cost, 0);
  const notes = state.notes.map((id) => noteLibrary[id]).filter(Boolean);

  useEffect(() => {
    if (state.started) localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  }, [state]);

  const runScanVisual = useCallback(() => {
    if (scanTimerRef.current !== null) window.clearTimeout(scanTimerRef.current);
    setReveal(false);
    window.requestAnimationFrame(() => setReveal(true));
    scanTimerRef.current = window.setTimeout(() => {
      setReveal(false);
      scanTimerRef.current = null;
    }, 2350);
  }, []);

  useEffect(
    () => () => {
      if (scanTimerRef.current !== null) window.clearTimeout(scanTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    setReveal(false);
  }, [room.id]);

  const chirp = useCallback(
    (tone: "soft" | "good" | "bad" = "soft") => {
      if (!soundOn) return;
      try {
        const context = audioRef.current ?? new AudioContext();
        audioRef.current = context;
        void context.resume();
        const pattern =
          tone === "good"
            ? [
                { frequency: 430, offset: 0, duration: 0.09, type: "triangle" as OscillatorType, level: 0.022 },
                { frequency: 680, offset: 0.045, duration: 0.11, type: "square" as OscillatorType, level: 0.014 },
              ]
            : tone === "bad"
              ? [
                  { frequency: 155, offset: 0, duration: 0.12, type: "sawtooth" as OscillatorType, level: 0.018 },
                  { frequency: 92, offset: 0.035, duration: 0.14, type: "square" as OscillatorType, level: 0.012 },
                ]
              : [
                  { frequency: 310, offset: 0, duration: 0.055, type: "square" as OscillatorType, level: 0.016 },
                  { frequency: 465, offset: 0.032, duration: 0.06, type: "triangle" as OscillatorType, level: 0.011 },
                ];

        for (const note of pattern) {
          const oscillator = context.createOscillator();
          const gain = context.createGain();
          const startsAt = context.currentTime + note.offset;
          oscillator.type = note.type;
          oscillator.frequency.setValueAtTime(note.frequency, startsAt);
          gain.gain.setValueAtTime(note.level, startsAt);
          gain.gain.exponentialRampToValueAtTime(0.0001, startsAt + note.duration);
          oscillator.connect(gain);
          gain.connect(context.destination);
          oscillator.start(startsAt);
          oscillator.stop(startsAt + note.duration);
        }
      } catch {
        // Audio is optional; game state never depends on it.
      }
    },
    [soundOn],
  );

  useEffect(() => {
    ambientStopRef.current?.();
    ambientStopRef.current = null;
    if (!soundOn) return;

    let context: AudioContext;
    try {
      context = audioRef.current ?? new AudioContext();
      audioRef.current = context;
    } catch {
      return;
    }

    const audioScene: RoomId = titleMode || state.ending ? "exterior" : state.currentRoom;
    const surface = ["exterior", "canyon", "rover"].includes(audioScene);
    const pitches: Record<RoomId, number> = {
      cryo: 43,
      lab: 52,
      power: 61,
      decon: 47,
      clean: 71,
      medical: 66,
      annex: 41,
      quarters: 49,
      mess: 57,
      comms: 82,
      exterior: 34,
      canyon: 30,
      rover: 38,
      uplink: 76,
    };
    const sources: Array<OscillatorNode | AudioBufferSourceNode> = [];
    const master = context.createGain();
    const compressor = context.createDynamicsCompressor();
    master.gain.setValueAtTime(0.0001, context.currentTime);
    master.gain.exponentialRampToValueAtTime(surface ? 0.34 : 0.24, context.currentTime + 1.6);
    master.connect(compressor);
    compressor.connect(context.destination);

    const addDrone = (frequency: number, type: OscillatorType, level: number, detune = 0) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      oscillator.detune.value = detune;
      gain.gain.value = level;
      oscillator.connect(gain);
      gain.connect(master);
      oscillator.start();
      sources.push(oscillator);
      return gain;
    };

    const base = pitches[audioScene];
    const primaryGain = addDrone(base, "sine", surface ? 0.042 : 0.032);
    addDrone(base * 1.5, "triangle", surface ? 0.011 : 0.008, 4);

    const breath = context.createOscillator();
    const breathDepth = context.createGain();
    breath.type = "sine";
    breath.frequency.value = surface ? 0.09 : 0.14;
    breathDepth.gain.value = surface ? 0.014 : 0.008;
    breath.connect(breathDepth);
    breathDepth.connect(primaryGain.gain);
    breath.start();
    sources.push(breath);

    const noiseBuffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let index = 0; index < noiseData.length; index += 1) {
      noiseData[index] = Math.random() * 2 - 1;
    }
    const noise = context.createBufferSource();
    const noiseFilter = context.createBiquadFilter();
    const noiseGain = context.createGain();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    noiseFilter.type = surface ? "bandpass" : "lowpass";
    noiseFilter.frequency.value = surface ? 430 : audioScene === "cryo" ? 1100 : 720;
    noiseFilter.Q.value = surface ? 0.55 : 0.3;
    noiseGain.gain.value = surface ? 0.055 : 0.018;
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(master);
    noise.start();
    sources.push(noise);

    if (["lab", "comms", "uplink"].includes(audioScene)) {
      const carrierGain = addDrone(audioScene === "comms" ? 164 : 126, "square", 0.0035);
      const carrierGate = context.createOscillator();
      const carrierDepth = context.createGain();
      carrierGate.type = "square";
      carrierGate.frequency.value = audioScene === "comms" ? 0.31 : 0.19;
      carrierDepth.gain.value = 0.0034;
      carrierGate.connect(carrierDepth);
      carrierDepth.connect(carrierGain.gain);
      carrierGate.start();
      sources.push(carrierGate);
    }

    if (state.signalTrace >= 3) {
      const alarmGain = addDrone(620, "sawtooth", 0.004);
      const alarmGate = context.createOscillator();
      const alarmDepth = context.createGain();
      alarmGate.type = "square";
      alarmGate.frequency.value = 0.72;
      alarmDepth.gain.value = 0.004;
      alarmGate.connect(alarmDepth);
      alarmDepth.connect(alarmGain.gain);
      alarmGate.start();
      sources.push(alarmGate);
    }

    const resumeAudio = () => void context.resume();
    if (context.state === "suspended") {
      window.addEventListener("pointerdown", resumeAudio, { once: true });
      window.addEventListener("keydown", resumeAudio, { once: true });
    } else {
      void context.resume();
    }

    let stopped = false;
    const stop = () => {
      if (stopped) return;
      stopped = true;
      window.removeEventListener("pointerdown", resumeAudio);
      window.removeEventListener("keydown", resumeAudio);
      master.gain.cancelScheduledValues(context.currentTime);
      master.gain.setTargetAtTime(0.0001, context.currentTime, 0.035);
      window.setTimeout(() => {
        for (const source of sources) {
          try {
            source.stop();
          } catch {
            // The source may have already ended during a fast room transition.
          }
        }
        master.disconnect();
        compressor.disconnect();
      }, 180);
    };
    ambientStopRef.current = stop;
    return stop;
  }, [soundOn, state.currentRoom, state.ending, state.signalTrace, titleMode]);

  const toggleSound = useCallback(() => {
    if (!soundOn) {
      try {
        const context = audioRef.current ?? new AudioContext();
        audioRef.current = context;
        void context.resume();
      } catch {
        // The control remains optional on browsers without Web Audio.
      }
    }
    setSoundOn((value) => !value);
  }, [soundOn]);

  const applyOutcome = useCallback(
    (result: Outcome) => {
      const derived = refreshDerivedFlags(result.state);
      setState(derived);
      if (result.dialogue) setDialogue(result.dialogue);
      if (result.modal) setModal(result.modal);
      chirp(result.dialogue ? "good" : "soft");
    },
    [chirp],
  );

  const pulseScan = useCallback(() => {
    const result = consumeLocalScan(state);
    const chargeSpent = result.state.scanCharges < state.scanCharges;
    if (!chargeSpent) {
      setState(result.state);
      chirp("bad");
      return;
    }
    runScanVisual();
    applyOutcome(result);
  }, [applyOutcome, chirp, runScanVisual, state]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Tab" && state.started && !titleMode) {
        event.preventDefault();
        pulseScan();
      }
      if (event.key === "Escape") {
        setModal(null);
        setDialogue(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pulseScan, state.started, titleMode]);

  const onHotspot = (hotspot: Hotspot) => applyOutcome(interact(state, hotspot.action));

  const onNavigate = (to: RoomId) => {
    const exit = rooms[state.currentRoom].exits.find((candidate) => candidate.to === to);
    if (!exit || !canUseExit(state, exit)) {
      chirp("bad");
      if (exit) applyOutcome(moveTo(state, to));
      return;
    }
    applyOutcome(moveTo(state, to));
  };

  const begin = (continueSave: boolean) => {
    if (continueSave && state.started) {
      setTitleMode(false);
      return;
    }
    const fresh = { ...newGame(), started: true };
    localStorage.setItem(SAVE_KEY, JSON.stringify(fresh));
    setState(fresh);
    setDialogue({
      speaker: "SUIT RECORDER",
      title: "CRASH SITE",
      portrait: "system",
      lines: [
        "Research Bay One. Crew revival exception.",
        "No clock is running against you. The world advances only when you act.",
        "Wake up.",
      ],
    });
    setTitleMode(false);
  };

  const restart = () => {
    const fresh = { ...newGame(), started: true };
    localStorage.setItem(SAVE_KEY, JSON.stringify(fresh));
    setState(fresh);
    setModal(null);
    setDialogue(null);
    setTitleMode(false);
    chirp("bad");
  };

  if (titleMode) {
    return (
      <TitleScreen
        hasSave={state.started && state.interactions > 0}
        soundOn={soundOn}
        onToggleSound={toggleSound}
        onNew={() => begin(false)}
        onContinue={() => begin(true)}
      />
    );
  }

  if (state.ending) {
    return (
      <EndingScreen
        state={state}
        onRestart={restart}
        onReturn={() => {
          setState({ ...state, ending: false });
          setTitleMode(true);
        }}
      />
    );
  }

  return (
    <main className={`game ${state.signalTrace >= 3 ? "game--alarm" : ""}`}>
      <header className="topbar">
        <button className="brand" type="button" onClick={() => setTitleMode(true)} aria-label="Return to title">
          <span className="brand__mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>
            <b>CRASH SITE</b>
            <small>RESEARCH BAY 01</small>
          </span>
        </button>

        <div className="topbar__objective">
          <span>ACTIVE THREAD</span>
          <strong>{objective}</strong>
        </div>

        <div className="status-cluster">
          <Status label="O₂" value={hasFlag(state, "life") ? "STABLE" : "CRITICAL"} tone={hasFlag(state, "life") ? "ok" : "warn"} />
          <Status label="PWR" value={`${usedPower}/${capacity} N`} tone={usedPower ? "ok" : "dim"} />
          <Status
            label="SIG"
            value={state.signalTrace >= 3 ? "ALARM" : state.signalTrace === 2 ? "TRACED" : state.signalTrace === 1 ? "FAINT" : "DARK"}
            tone={state.signalTrace >= 2 ? "warn" : "dim"}
          />
        </div>
      </header>

      <div className="workspace">
        <aside className="map-panel panel">
          <div className="panel__heading">
            <span>SITE MAP</span>
            <b>{regionFor(state.currentRoom).toUpperCase()}</b>
          </div>
          <nav aria-label="Location map">
            {navOrder.map((id, index) => {
              const navRoom = rooms[id];
              const current = id === state.currentRoom;
              const discovered = state.roomsVisited.includes(id);
              const directExit = room.exits.find((candidate) => candidate.to === id);
              const adjacent = Boolean(directExit && canUseExit(state, directExit));
              if (!discovered && !current) return null;
              return (
                <button
                  type="button"
                  key={id}
                  className={`${current ? "is-current" : ""} ${!current && !adjacent ? "is-remote" : ""}`}
                  onClick={() => onNavigate(id)}
                  disabled={current || !adjacent}
                  title={current ? "Current location" : adjacent ? `Travel to ${navRoom.name}` : "Charted; not directly adjacent"}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <b>{navRoom.name}</b>
                  <i aria-hidden="true" />
                </button>
              );
            })}
          </nav>
          <div className="map-panel__footer">
            <button
              type="button"
              onClick={pulseScan}
              className={`${reveal ? "is-active" : ""} ${state.scanCharges === 0 ? "is-exhausted" : ""}`}
              aria-pressed={reveal}
              aria-label={`Pulse local scan. ${state.scanCharges} capacitor charge${state.scanCharges === 1 ? " remains" : "s remain"}.`}
            >
              <kbd>TAB</kbd>
              <span>{reveal ? "Local scan pulsing" : "Pulse local scan"}</span>
              <b aria-hidden="true">{state.scanCharges}×</b>
            </button>
            <div className={`scan-meta ${state.signalTrace >= 3 ? "is-alarm" : ""}`}>
              <span>CAP {state.scanCharges}/6</span>
              <span>TRACE {state.signalTrace}/3</span>
            </div>
          </div>
        </aside>

        <section className="stage">
          <div className="stage__header">
            <div>
              <span>{room.sector}</span>
              <h1>{room.name}</h1>
            </div>
            <div className="stage__readout">
              <i aria-hidden="true" />
              <span>{ambience}</span>
            </div>
          </div>

          <div className="scene-frame">
            <PixelScene room={room} state={state} hotspots={hotspots} reveal={reveal} onHotspot={onHotspot} />
            <div className="scene-frame__id">OPTICAL FEED {String(navOrder.indexOf(room.id) + 1).padStart(2, "0")}</div>
          </div>

          <div className="scene-caption">
            <p>{room.description}</p>
            <div className="exit-row" aria-label="Adjacent routes">
              {room.exits.map((exit) => {
                const open = !exit.condition || hasFlag(state, exit.condition);
                const discovered = state.roomsVisited.includes(exit.to);
                const routeLabel = discovered ? exit.label : (exit.approach ?? "Unsurveyed access");
                return (
                  <button
                    key={`${exit.to}-${exit.label}`}
                    type="button"
                    className={!open ? "is-locked" : ""}
                    onClick={() => applyOutcome(moveTo(state, exit.to))}
                  >
                    <span>{open ? (discovered ? "ROUTE" : "UNSURVEYED") : "SEALED"}</span>
                    <b>{routeLabel}</b>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <aside className="data-panel panel">
          <div className="panel__heading">
            <span>APOLLO</span>
            <b>{hasFlag(state, "apolloPowered") ? "COGNITION 100%" : hasFlag(state, "apolloMet") ? "COGNITION 3%" : "NO LINK"}</b>
          </div>
          <div className={`apollo-card ${hasFlag(state, "apolloPowered") ? "is-online" : ""}`}>
            <div className="apollo-avatar" aria-hidden="true">
              <span />
              <i />
              <b />
            </div>
            <p>
              {hasFlag(state, "apolloMet")
                ? hasFlag(state, "apolloPowered")
                  ? "Laboratory assistant / archive witness"
                  : "Fragmented assistant process"
                : "Assistant process undiscovered"}
            </p>
            <button
              type="button"
              disabled={!hasFlag(state, "apolloMet")}
              onClick={() =>
                setDialogue({
                  speaker: "APOLLO",
                  title: "CONTEXTUAL ASSIST",
                  portrait: "apollo",
                  lines: [getHint(state)],
                })
              }
            >
              Ask for direction
            </button>
          </div>

          <div className="data-block">
            <span>RECOVERED ARCHIVE</span>
            <button type="button" onClick={() => setModal("notes")}>
              <b>{notes.length}</b>
              <span>notes indexed</span>
              <i>OPEN</i>
            </button>
          </div>

          <div className="data-block data-block--controls">
            <span>SYSTEM</span>
            <button type="button" onClick={toggleSound} aria-pressed={soundOn}>
              <b>{soundOn ? "ON" : "OFF"}</b>
              <span>ambient + interface audio</span>
            </button>
            <button type="button" onClick={() => setModal("help")}>
              <b>?</b>
              <span>controls & premise</span>
            </button>
          </div>
        </aside>
      </div>

      <footer className="command-deck">
        <div className="transcript" role="status" aria-live="polite">
          <span>FIELD NOTE / {String(state.interactions).padStart(3, "0")}</span>
          <p key={state.interactions}>{state.lastMessage}</p>
        </div>
        <Inventory
          state={state}
          onSelect={(itemId) => {
            setState(inspectItem(state, itemId));
            chirp();
          }}
        />
      </footer>

      {dialogue && <DialogueLayer dialogue={dialogue} onClose={() => setDialogue(null)} />}
      {modal && (
        <ModalLayer
          modal={modal}
          state={state}
          onClose={() => setModal(null)}
          onOutcome={(result) => {
            setModal(null);
            applyOutcome(result);
          }}
          onRestart={restart}
        />
      )}
    </main>
  );
}

function Status({ label, value, tone }: { label: string; value: string; tone: "ok" | "warn" | "dim" }) {
  return (
    <div className={`status status--${tone}`}>
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}

function Inventory({ state, onSelect }: { state: GameState; onSelect: (item: string) => void }) {
  return (
    <div className="inventory" aria-label="Inventory">
      <div className="inventory__label">
        <span>FIELD KIT</span>
        <b>{state.inventory.length}/8</b>
      </div>
      <div className="inventory__slots">
        {Array.from({ length: 8 }).map((_, index) => {
          const itemId = state.inventory[index];
          const item = itemId ? items[itemId] : undefined;
          return (
            <button
              key={itemId ?? `empty-${index}`}
              type="button"
              className={`${item ? "has-item" : ""} ${state.selectedItem === itemId ? "is-selected" : ""}`}
              disabled={!item}
              onClick={() => item && onSelect(item.id)}
              title={item?.description}
            >
              {item ? (
                <>
                  <i aria-hidden="true">{item.glyph}</i>
                  <span>{item.short}</span>
                </>
              ) : (
                <small>{String(index + 1).padStart(2, "0")}</small>
              )}
            </button>
          );
        })}
      </div>
      <div className="inventory__selected">
        <span>SELECTED</span>
        <b>{state.selectedItem ? items[state.selectedItem]?.short : "None"}</b>
      </div>
    </div>
  );
}

function DialogueLayer({ dialogue, onClose }: { dialogue: Dialogue; onClose: () => void }) {
  const [page, setPage] = useState(0);
  const line = dialogue.lines[page];
  const final = page >= dialogue.lines.length - 1;

  useEffect(() => setPage(0), [dialogue]);

  return (
    <div className="overlay overlay--dialogue" role="dialog" aria-modal="true" aria-label={dialogue.speaker}>
      <button className="overlay__scrim" type="button" onClick={onClose} aria-label="Close dialogue" />
      <section className="dialogue-box">
        <Portrait kind={dialogue.portrait ?? "system"} />
        <div className="dialogue-box__copy">
          <span>{dialogue.title ?? "LOCAL MESSAGE"}</span>
          <h2>{dialogue.speaker}</h2>
          <p>{line}</p>
          <div className="dialogue-box__progress">
            {dialogue.lines.map((_, index) => (
              <i key={index} className={index <= page ? "is-filled" : ""} />
            ))}
          </div>
        </div>
        <button
          className="dialogue-box__next"
          type="button"
          onClick={() => (final ? onClose() : setPage((value) => value + 1))}
        >
          {final ? "Close" : "Continue"}
          <span>›</span>
        </button>
      </section>
    </div>
  );
}

function Portrait({ kind }: { kind: "apollo" | "system" | "crew" }) {
  return (
    <div className={`portrait portrait--${kind}`} aria-hidden="true">
      {kind === "apollo" ? (
        <>
          <span />
          <i />
          <b />
        </>
      ) : (
        <>
          <em>{kind === "crew" ? "MV" : "01"}</em>
          <span />
        </>
      )}
    </div>
  );
}

interface ModalLayerProps {
  modal: ModalId | "notes" | "help";
  state: GameState;
  onClose: () => void;
  onOutcome: (outcome: Outcome) => void;
  onRestart: () => void;
}

function ModalLayer({ modal, state, onClose, onOutcome, onRestart }: ModalLayerProps) {
  return (
    <div className="overlay overlay--modal" role="dialog" aria-modal="true">
      <button className="overlay__scrim" type="button" onClick={onClose} aria-label="Close panel" />
      {modal === "power" && <PowerPanel state={state} onClose={onClose} onOutcome={onOutcome} />}
      {modal === "clean" && <CleanPanel state={state} onClose={onClose} onOutcome={onOutcome} />}
      {modal === "keypad" && <KeypadPanel state={state} onClose={onClose} onOutcome={onOutcome} />}
      {modal === "comms" && <CommsPanel state={state} onClose={onClose} onOutcome={onOutcome} />}
      {modal === "final" && <FinalPanel state={state} onClose={onClose} onOutcome={onOutcome} />}
      {modal === "notes" && <NotesPanel state={state} onClose={onClose} />}
      {modal === "help" && <HelpPanel onClose={onClose} onRestart={onRestart} />}
    </div>
  );
}

function PanelShell({
  eyebrow,
  title,
  children,
  onClose,
  wide = false,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  return (
    <section className={`modal-panel ${wide ? "modal-panel--wide" : ""}`}>
      <header>
        <div>
          <span>{eyebrow}</span>
          <h2>{title}</h2>
        </div>
        <button type="button" onClick={onClose} aria-label="Close">
          ×
        </button>
      </header>
      {children}
    </section>
  );
}

function PowerPanel({ state, onClose, onOutcome }: Pick<ModalLayerProps, "state" | "onClose" | "onOutcome">) {
  const [selected, setSelected] = useState<CircuitId[]>(state.powerRoutes);
  const capacity = hasFlag(state, "busRepaired") ? 220 : 160;
  const used = selected.reduce((sum, id) => sum + circuits[id].cost, 0);
  const overloaded = used > capacity;

  const toggle = (id: CircuitId) => {
    if (state.powerRoutes.includes(id)) return;
    setSelected((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]));
  };

  return (
    <PanelShell eyebrow="JUNCTION 01 / MANUAL MODE" title="Power routing" onClose={onClose} wide>
      <div className="power-summary">
        <div>
          <span>GENERATOR CAPACITY</span>
          <b>{capacity} N</b>
        </div>
        <div className={overloaded ? "is-danger" : ""}>
          <span>ROUTED LOAD</span>
          <b>{used} N</b>
        </div>
        <div>
          <span>AUXILIARY BUS</span>
          <b>{hasFlag(state, "busRepaired") ? "+60 ONLINE" : "OPEN CIRCUIT"}</b>
        </div>
      </div>
      <div className="power-rail">
        <i style={{ width: `${Math.min(100, (used / capacity) * 100)}%` }} className={overloaded ? "is-danger" : ""} />
      </div>
      <div className="circuit-list">
        {(Object.keys(circuits) as CircuitId[]).map((id) => {
          const circuit = circuits[id];
          const active = selected.includes(id);
          return (
            <button type="button" key={id} className={active ? "is-active" : ""} onClick={() => toggle(id)}>
              <span className="circuit-toggle">
                <i />
              </span>
              <span>
                <b>{circuit.name}</b>
                <small>{circuit.detail}</small>
              </span>
              <strong>{circuit.cost} N</strong>
            </button>
          );
        })}
      </div>
      {!hasFlag(state, "busRepaired") && (
        <p className="panel-warning">Auxiliary capacity is unavailable. Repair the burned bus in the room to power all three systems.</p>
      )}
      <div className="panel-actions">
        <button type="button" className="button button--ghost" onClick={onClose}>
          Cancel
        </button>
        <button type="button" className="button button--primary" disabled={overloaded} onClick={() => onOutcome(commitPower(state, selected))}>
          Commit routing
        </button>
      </div>
    </PanelShell>
  );
}

function CleanPanel({ state, onClose, onOutcome }: Pick<ModalLayerProps, "state" | "onClose" | "onOutcome">) {
  const [sequence, setSequence] = useState<string[]>([]);
  const colors = ["cyan", "amber", "violet"];

  const press = (color: string) => {
    const next = [...sequence, color].slice(-3);
    setSequence(next);
    if (next.length === 3) {
      window.setTimeout(() => onOutcome(solveClean(state, next)), 180);
    }
  };

  return (
    <PanelShell eyebrow="PNEUMATIC INTERLOCK" title="Emergency materials" onClose={onClose}>
      <p className="panel-intro">Repeat the room's three-step sterilization cycle.</p>
      <div className="sequence-readout">
        {[0, 1, 2].map((index) => (
          <i key={index} className={sequence[index] ? `color-${sequence[index]}` : ""} />
        ))}
      </div>
      <div className="color-controls">
        {colors.map((color) => (
          <button key={color} type="button" className={`color-${color}`} onClick={() => press(color)}>
            <i />
            <span>{color}</span>
          </button>
        ))}
      </div>
      <div className="panel-actions">
        <button type="button" className="button button--ghost" onClick={() => setSequence([])}>
          Clear
        </button>
      </div>
    </PanelShell>
  );
}

function KeypadPanel({ state, onClose, onOutcome }: Pick<ModalLayerProps, "state" | "onClose" | "onOutcome">) {
  const [code, setCode] = useState("");
  const push = (digit: string) => setCode((value) => `${value}${digit}`.slice(-4));

  return (
    <PanelShell eyebrow="LOCKER 04 / EMERGENCY PIN" title="Personal storage" onClose={onClose}>
      <div className="keypad-display">{code.padEnd(4, "·")}</div>
      <div className="keypad">
        {"123456789".split("").map((digit) => (
          <button type="button" key={digit} onClick={() => push(digit)}>
            {digit}
          </button>
        ))}
        <button type="button" onClick={() => setCode("")}>
          C
        </button>
        <button type="button" onClick={() => push("0")}>
          0
        </button>
        <button type="button" onClick={() => onOutcome(solveKeypad(state, code))} disabled={code.length !== 4}>
          ↵
        </button>
      </div>
    </PanelShell>
  );
}

function CommsPanel({ state, onClose, onOutcome }: Pick<ModalLayerProps, "state" | "onClose" | "onOutcome">) {
  const [pulses, setPulses] = useState<("short" | "long")[]>(["short", "short", "short", "short"]);
  const toggle = (index: number) =>
    setPulses((current) => current.map((pulse, i) => (i === index ? (pulse === "short" ? "long" : "short") : pulse)));

  return (
    <PanelShell eyebrow="LOCAL CARRIER / MANUAL FILTER" title="Pulse decoder" onClose={onClose} wide>
      <p className="panel-intro">Set the four-pulse key, then let Apollo and the Vion scanner strip the accumulated noise.</p>
      <div className="waveform" aria-hidden="true">
        {Array.from({ length: 48 }).map((_, index) => (
          <i key={index} style={{ height: `${16 + ((index * 17) % 47)}%` }} />
        ))}
      </div>
      <div className="pulse-grid">
        {pulses.map((pulse, index) => (
          <button type="button" key={index} onClick={() => toggle(index)} className={`is-${pulse}`}>
            <span>Pulse {index + 1}</span>
            <i />
            <b>{pulse}</b>
          </button>
        ))}
      </div>
      <div className="panel-actions">
        <button type="button" className="button button--ghost" onClick={onClose}>
          Cancel
        </button>
        <button type="button" className="button button--primary" onClick={() => onOutcome(solveComms(state, pulses))}>
          Decode carrier
        </button>
      </div>
    </PanelShell>
  );
}

function FinalPanel({ state, onClose, onOutcome }: Pick<ModalLayerProps, "state" | "onClose" | "onOutcome">) {
  const [sequence, setSequence] = useState<string[]>([]);
  const protocols = [
    { id: "map", name: "Mapping 317", detail: "LOCATE / orbital biosphere sweep" },
    { id: "witness", name: "Biosphere Witness", detail: "LISTEN / accept living telemetry" },
    { id: "hold", name: "Red Transcendence 2.9", detail: "HOLD / suspend conversion" },
  ];

  const choose = (id: string) => {
    if (sequence.includes(id)) return;
    const next = [...sequence, id];
    setSequence(next);
    if (next.length === 3) window.setTimeout(() => onOutcome(solveFinal(state, next)), 180);
  };

  return (
    <PanelShell eyebrow="REMOTE TERRAFORMER AUTHORITY" title="Doctrine reconstruction" onClose={onClose} wide>
      <p className="panel-intro">Build the authorization chain in the order its makers intended.</p>
      <div className="final-sequence">
        {[0, 1, 2].map((index) => {
          const protocol = protocols.find((entry) => entry.id === sequence[index]);
          return (
            <div key={index} className={protocol ? "is-filled" : ""}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <b>{protocol?.name ?? "Awaiting protocol"}</b>
            </div>
          );
        })}
      </div>
      <div className="protocol-grid">
        {protocols.map((protocol) => (
          <button
            type="button"
            key={protocol.id}
            onClick={() => choose(protocol.id)}
            disabled={sequence.includes(protocol.id)}
          >
            <span>{protocol.detail}</span>
            <b>{protocol.name}</b>
          </button>
        ))}
      </div>
      <div className="panel-actions">
        <button type="button" className="button button--ghost" onClick={() => setSequence([])}>
          Clear chain
        </button>
      </div>
    </PanelShell>
  );
}

function NotesPanel({ state, onClose }: Pick<ModalLayerProps, "state" | "onClose">) {
  const notes = state.notes.map((id) => noteLibrary[id]).filter(Boolean);
  return (
    <PanelShell eyebrow="APOLLO / RECOVERED ARCHIVE" title={`${notes.length} indexed notes`} onClose={onClose} wide>
      <div className="notes-list">
        {notes.length === 0 ? (
          <div className="empty-state">No stable records recovered.</div>
        ) : (
          notes.map((note, index) => (
            <article key={note.id}>
              <span>{String(index + 1).padStart(2, "0")} / {note.source}</span>
              <h3>{note.title}</h3>
              <p>{note.body}</p>
            </article>
          ))
        )}
      </div>
    </PanelShell>
  );
}

function HelpPanel({ onClose, onRestart }: { onClose: () => void; onRestart: () => void }) {
  return (
    <PanelShell eyebrow="FIELD MANUAL" title="How to play" onClose={onClose}>
      <div className="help-copy">
        <p>
          Search the scene for small equipment lights, glints, vapor, and other motion. When the cursor finds an object,
          its name appears. Press <kbd>Tab</kbd> for a brief local scan pulse—it reveals signals, not object outlines.
          Pulses consume capacitor charge and increase your detectable signal trace. The third trace triggers an alarm;
          a fully powered Apollo can bleed trace while you move.
        </p>
        <p>
          Select an inventory item, then click the object you want to use it with. A bright frame marks the selected item.
        </p>
        <p>
          This story is turn-based. Oxygen, storms, and machine events never advance while you read, think, or step away.
          Rooms appear on the site map only after you physically enter them. The map records where you have been; it only
          lets you traverse a room that is directly adjacent. Enter new spaces through doors, hatches, trails, or the route
          strip beneath the scene. There are no unwinnable states.
        </p>
        <p>
          Ambient audio changes by location. The SYSTEM control—or the title-screen sound control—can mute it at any time.
        </p>
      </div>
      <div className="panel-actions panel-actions--split">
        <button type="button" className="button button--danger" onClick={onRestart}>
          Restart story
        </button>
        <button type="button" className="button button--primary" onClick={onClose}>
          Return
        </button>
      </div>
    </PanelShell>
  );
}

function TitleScreen({
  hasSave,
  soundOn,
  onToggleSound,
  onNew,
  onContinue,
}: {
  hasSave: boolean;
  soundOn: boolean;
  onToggleSound: () => void;
  onNew: () => void;
  onContinue: () => void;
}) {
  return (
    <main className="title-screen">
      <img src={`${import.meta.env.BASE_URL}assets/rooms/station-exterior.png`} alt="" />
      <div className="title-screen__grade" />
      <div className="title-screen__grid" />
      <section className="title-card">
        <div className="title-card__eyebrow">
          <i />
          <span>A TURN-BASED POINT & CLICK STORY</span>
        </div>
        <h1>
          CRASH
          <br />
          <em>SITE</em>
        </h1>
        <p>
          You slept through the end of everything.
          <br />
          Something finally came to wake you.
        </p>
        <div className="title-card__actions">
          <button type="button" className="button button--primary" onClick={onNew}>
            Begin revival
            <span>›</span>
          </button>
          {hasSave && (
            <button type="button" className="button button--ghost" onClick={onContinue}>
              Continue autosave
            </button>
          )}
          <button type="button" className="button button--sound" onClick={onToggleSound} aria-pressed={soundOn}>
            <span aria-hidden="true">{soundOn ? "◉" : "○"}</span>
            Sound {soundOn ? "on" : "off"}
          </button>
        </div>
        <div className="title-card__meta">
          <span>20–30 MIN</span>
          <span>NO TIMER</span>
          <span>AUTOSAVES</span>
          <span>INTERIOR + SURFACE</span>
        </div>
      </section>
      <div className="title-screen__footer">
        <span>RESEARCH BAY ONE</span>
        <b>LOCAL ELAPSED TIME / 887,842,500 YEARS</b>
      </div>
    </main>
  );
}

function EndingScreen({
  state,
  onRestart,
  onReturn,
}: {
  state: GameState;
  onRestart: () => void;
  onReturn: () => void;
}) {
  return (
    <main className="ending-screen">
      <img src={`${import.meta.env.BASE_URL}assets/rooms/rover-uplink.png`} alt="" />
      <div className="ending-screen__wash" />
      <section className="ending-card">
        <span>RED TRANSCENDENCE / SAFE HOLD</span>
        <h1>The machine notices you.</h1>
        <div className="ending-copy">
          <p>The beam shutters. The ash keeps moving, but the planet is no longer being rewritten beneath it.</p>
          <p>
            Seven sleepers remain alive in Research Bay One. A cargo beacon still points toward a hidden ship. Apollo has ten
            nellons and, for the first time in eight hundred million years, a complete memory.
          </p>
          <blockquote>“Doctor,” Apollo says, green and steady. “I seem to have misplaced your name.”</blockquote>
          <p>You tell him.</p>
        </div>
        <div className="ending-stats">
          <div>
            <span>FIELD ACTIONS</span>
            <b>{state.interactions}</b>
          </div>
          <div>
            <span>ROOMS FOUND</span>
            <b>{state.roomsVisited.length}/14</b>
          </div>
          <div>
            <span>ARCHIVES</span>
            <b>{state.notes.length}/9</b>
          </div>
          <div>
            <span>SLEEPERS</span>
            <b>7 ALIVE</b>
          </div>
        </div>
        <div className="title-card__actions">
          <button type="button" className="button button--primary" onClick={onReturn}>
            Return to title
          </button>
          <button type="button" className="button button--ghost" onClick={onRestart}>
            Play again
          </button>
        </div>
      </section>
    </main>
  );
}

export default App;
