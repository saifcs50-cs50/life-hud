import { Volume2, VolumeX, Wind, Waves } from "lucide-react";
import { clsx } from "clsx";
import { useUiStore } from "../store/uiStore";

const TRACKS = [
  { key: "off" as const, label: "Off", icon: VolumeX },
  { key: "garage" as const, label: "Garage", icon: Wind },
  { key: "rain" as const, label: "Rain", icon: Waves },
];

export function AudioControl() {
  const ambientTrack = useUiStore((s) => s.ambientTrack);
  const setAmbientTrack = useUiStore((s) => s.setAmbientTrack);
  const ambientVolume = useUiStore((s) => s.ambientVolume);
  const setAmbientVolume = useUiStore((s) => s.setAmbientVolume);

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-white/5 bg-white/[0.02] p-3">
      <div className="flex items-center gap-1.5 text-xs font-medium text-ink-500">
        <Volume2 className="h-3.5 w-3.5" />
        Ambient
      </div>
      <div className="flex gap-1.5">
        {TRACKS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setAmbientTrack(key)}
            className={clsx(
              "flex flex-1 flex-col items-center gap-1 rounded-lg border px-2 py-1.5 text-[10px] font-medium transition-colors",
              ambientTrack === key
                ? "border-telemetry-400/40 bg-telemetry-500/10 text-telemetry-300"
                : "border-white/5 bg-white/[0.02] text-ink-700 hover:bg-white/[0.05]",
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>
      {ambientTrack !== "off" && (
        <input
          type="range"
          min={0}
          max={0.6}
          step={0.02}
          value={ambientVolume}
          onChange={(e) => setAmbientVolume(Number(e.target.value))}
          className="accent-telemetry-400"
        />
      )}
    </div>
  );
}
