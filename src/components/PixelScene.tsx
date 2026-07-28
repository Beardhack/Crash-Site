import { useEffect, useMemo, useState, type CSSProperties } from "react";
import type { GameState, Hotspot, Room } from "../game/adventure";

interface PixelSceneProps {
  room: Room;
  state: GameState;
  hotspots: Hotspot[];
  reveal: boolean;
  onHotspot: (hotspot: Hotspot) => void;
}

export default function PixelScene({ room, state, hotspots, reveal, onHotspot }: PixelSceneProps) {
  const [loaded, setLoaded] = useState(false);
  const [impact, setImpact] = useState<{ id: string; nonce: number } | null>(null);

  const atmosphere = useMemo(() => {
    if (["exterior", "canyon", "rover"].includes(room.id)) return "dust";
    if (["cryo", "annex"].includes(room.id)) return "cold";
    if (["lab", "comms", "uplink"].includes(room.id)) return "signal";
    if (room.id === "power") return "embers";
    return "motes";
  }, [room.id]);

  const particles = useMemo(() => {
    const seed = [...room.id].reduce((total, character) => total + character.charCodeAt(0), 0);
    return Array.from({ length: 12 }, (_, index) => {
      const x = (seed * (index + 5) * 17) % 101;
      const y = (seed * (index + 3) * 29) % 91;
      return {
        "--particle-x": `${x}%`,
        "--particle-y": `${y}%`,
        "--particle-delay": `${-((seed + index * 13) % 80) / 10}s`,
        "--particle-duration": `${5.5 + ((seed + index * 7) % 55) / 10}s`,
        "--particle-scale": `${0.55 + ((seed + index * 11) % 75) / 100}`,
      } as CSSProperties;
    });
  }, [room.id]);

  useEffect(() => {
    setLoaded(false);
    setImpact(null);
  }, [room.image]);

  const triggerHotspot = (hotspot: Hotspot) => {
    setImpact((current) => ({ id: hotspot.id, nonce: (current?.nonce ?? 0) + 1 }));
    onHotspot(hotspot);
  };

  return (
    <div
      className={`scene ${loaded ? "scene--loaded" : ""} ${reveal ? "scene--reveal" : ""} ${
        state.ending ? "scene--ending" : ""
      } ${state.signalTrace >= 3 ? "scene--alarm" : ""}`}
      data-atmosphere={atmosphere}
      data-room={room.id}
      aria-label={`${room.name}. ${room.description}`}
    >
      <img
        className="scene__image"
        src={room.image}
        alt=""
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(false)}
      />
      {!loaded && (
        <div className="scene__loading">
          <span />
          <b>RECONSTRUCTING OPTICAL FEED</b>
        </div>
      )}
      <div className="scene__grade" aria-hidden="true" />
      <div className="scene__scanlines" aria-hidden="true" />
      <div className="scene__light" aria-hidden="true" />
      <div className="scene__atmosphere" aria-hidden="true">
        {particles.map((style, index) => (
          <i key={index} style={style} />
        ))}
      </div>
      <div className="scene__sensor-sweep" aria-hidden="true" />
      {state.signalTrace >= 3 && (
        <div className="scene__alarm" aria-hidden="true">
          <span>PROXIMITY TRACE // CARRIER EXPOSED</span>
        </div>
      )}

      {hotspots.map((hotspot, index) => {
        const [left, top, width, height] = hotspot.area;
        const armed = Boolean(state.selectedItem);
        const signalStyle = {
          left: `${left}%`,
          top: `${top}%`,
          width: `${width}%`,
          height: `${height}%`,
          "--signal-delay": `${-((index * 1.37) % 5.4)}s`,
          "--scan-delay": `${index * 70}ms`,
        } as CSSProperties;
        return (
          <button
            key={hotspot.id}
            type="button"
            className={`hotspot hotspot--${hotspot.kind ?? "inspect"} ${armed ? "hotspot--armed" : ""}`}
            style={signalStyle}
            onClick={() => triggerHotspot(hotspot)}
            aria-label={hotspot.label}
          >
            <span className="hotspot__signal" aria-hidden="true">
              <i />
            </span>
            <span className="hotspot__label">{hotspot.label}</span>
            {impact?.id === hotspot.id && (
              <span key={impact.nonce} className="hotspot__impact" aria-hidden="true" />
            )}
          </button>
        );
      })}

      <div className="scene__corner scene__corner--tl" aria-hidden="true" />
      <div className="scene__corner scene__corner--tr" aria-hidden="true" />
      <div className="scene__corner scene__corner--bl" aria-hidden="true" />
      <div className="scene__corner scene__corner--br" aria-hidden="true" />
    </div>
  );
}
