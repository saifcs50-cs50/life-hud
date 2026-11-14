interface WaterFillBarProps {
  fillPct: number;
}

/** Flat 2D fallback for the 3D water cylinder — used directly under Eco Mode. */
export function WaterFillBar({ fillPct }: WaterFillBarProps) {
  return (
    <div className="relative h-32 w-14 shrink-0 overflow-hidden rounded-full border border-telemetry-400/30 bg-white/[0.02]">
      <div
        className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-telemetry-600 to-telemetry-400/80 transition-[height] duration-500 ease-out"
        style={{ height: `${fillPct}%` }}
      />
      <div className="absolute inset-0 rounded-full ring-1 ring-white/10" />
    </div>
  );
}
