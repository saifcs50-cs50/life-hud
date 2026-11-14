interface TireWearFallbackProps {
  gripPct: number;
}

export function TireWearFallback({ gripPct }: TireWearFallbackProps) {
  const color = gripPct > 50 ? "#34e8a0" : gripPct > 25 ? "#ffb020" : "#ff2b4d";
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2">
      <div className="h-3 w-full max-w-[160px] overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${gripPct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
