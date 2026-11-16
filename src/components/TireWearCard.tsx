import { Wrench } from "lucide-react";
import { motion } from "framer-motion";
import { GlassCard } from "./GlassCard";
import { Viewport3D } from "./Viewport3D";
import { TireWear3D } from "../three/TireWear3D";
import { TireWearFallback } from "./TireWearFallback";
import { useDailyLogStore } from "../store/dailyLogStore";
import { computeGripPct } from "../lib/gamification";

export function TireWearCard() {
  const { log, update } = useDailyLogStore();

  if (!log) {
    return (
      <GlassCard
        blur={false}
        className="flex min-h-[240px] items-center justify-center p-6"
      >
        <p className="font-tele text-xs text-ink-700">SPOOLING…</p>
      </GlassCard>
    );
  }

  const pitStops = log.pitStops ?? 0;
  const gripPct = computeGripPct(log);

  return (
    <GlassCard blur={false} className="flex flex-col gap-3 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-ink-100">Tire Wear</h2>
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={() => update({ pitStops: pitStops + 1 })}
          className="flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300 hover:bg-amber-500/20"
        >
          <Wrench className="h-3.5 w-3.5" />
          Pit Stop
        </motion.button>
      </div>
      <Viewport3D
        className="h-56 w-full"
        fallback={<TireWearFallback gripPct={gripPct} />}
      >
        <TireWear3D gripPct={gripPct} />
      </Viewport3D>
      <p className="font-tele text-center text-xs text-ink-500">
        {Math.round(gripPct)}% grip remaining
      </p>
    </GlassCard>
  );
}
