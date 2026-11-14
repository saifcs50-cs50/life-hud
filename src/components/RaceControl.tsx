import { Zap, TrendingUp, Wind, Flag, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { clsx } from "clsx";
import { GlassCard } from "./GlassCard";
import { useTelemetryEngine } from "../lib/useTelemetryEngine";
import { useDailyLogStore } from "../store/dailyLogStore";
import { SLIPSTREAM_MULTIPLIER } from "../lib/gamification";

interface RaceBarProps {
  label: string;
  hours: number;
  colorClass: string;
  max: number;
}

function RaceBar({ label, hours, colorClass, max }: RaceBarProps) {
  const pct = max > 0 ? Math.min(100, (hours / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 shrink-0 text-xs font-medium text-ink-500">
        {label}
      </span>
      <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-white/5">
        <div
          className={clsx(
            "h-full rounded-full transition-all duration-500",
            colorClass,
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="font-tele w-14 shrink-0 text-right text-xs text-ink-300">
        {hours.toFixed(1)}h
      </span>
    </div>
  );
}

export function RaceControl() {
  const telemetry = useTelemetryEngine();
  const update = useDailyLogStore((s) => s.update);

  if (!telemetry) {
    return (
      <GlassCard className="flex h-40 items-center justify-center">
        <p className="font-tele text-sm text-ink-700">
          SPOOLING TELEMETRY…
        </p>
      </GlassCard>
    );
  }

  const {
    todayHours,
    pastBest,
    rival,
    streak,
    multiplier,
    slipstream,
    blackFlag,
    todayXP,
    totalXP,
    mascot,
    fastestLap,
    todayLog,
  } = telemetry;

  const maxHours = Math.max(todayHours, pastBest, rival, 1);
  const aheadOfRival = todayHours - rival;

  return (
    <GlassCard
      glow={blackFlag ? "throttle" : slipstream ? "streak" : "telemetry"}
      className="p-6"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-ink-100">Race Control</h2>
        <div className="flex flex-wrap items-center gap-2">
          {slipstream && (
            <span className="glow-streak flex items-center gap-1.5 rounded-full border border-streak-500/40 bg-streak-500/10 px-3 py-1 text-xs font-medium text-streak-300">
              <Wind className="h-3.5 w-3.5" /> Slipstream ×{SLIPSTREAM_MULTIPLIER}
            </span>
          )}
          {blackFlag && (
            <span className="glow-throttle flex items-center gap-1.5 rounded-full border border-throttle-500/40 bg-throttle-500/10 px-3 py-1 text-xs font-medium text-throttle-300">
              <Flag className="h-3.5 w-3.5" /> Black Flag — Rival boosted
            </span>
          )}
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => update({ drsActive: !todayLog?.drsActive })}
            className={clsx(
              "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              todayLog?.drsActive
                ? "glow-amber border-amber-400/40 bg-amber-500/10 text-amber-300"
                : "border-white/10 bg-white/[0.02] text-ink-500 hover:bg-white/[0.05]",
            )}
          >
            <Zap className="h-3.5 w-3.5" /> DRS Zone
          </motion.button>
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-2.5">
        <RaceBar
          label="You"
          hours={todayHours}
          colorClass="bg-telemetry-400"
          max={maxHours}
        />
        <RaceBar
          label="Past Self"
          hours={pastBest}
          colorClass="bg-ink-500"
          max={maxHours}
        />
        <RaceBar
          label="AI Rival"
          hours={rival}
          colorClass="bg-throttle-400"
          max={maxHours}
        />
      </div>
      <p className="font-tele mb-6 text-xs text-ink-700">
        {aheadOfRival >= 0
          ? `+${aheadOfRival.toFixed(1)}h ahead of rival`
          : `${aheadOfRival.toFixed(1)}h behind rival`}
      </p>

      <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-5 sm:grid-cols-4">
        <div>
          <p className="mb-1 flex items-center gap-1.5 text-xs font-medium tracking-wide text-ink-500 uppercase">
            <TrendingUp className="h-3.5 w-3.5" /> Combo
          </p>
          <p className="font-tele text-xl text-ink-100">
            {streak}d{" "}
            <span className="text-sm text-streak-400">
              ×{multiplier.toFixed(2)}
            </span>
          </p>
        </div>
        <div>
          <p className="mb-1 text-xs font-medium tracking-wide text-ink-500 uppercase">
            Today&rsquo;s XP
          </p>
          <p className="font-tele text-xl text-telemetry-300">{todayXP}</p>
        </div>
        <div>
          <p className="mb-1 text-xs font-medium tracking-wide text-ink-500 uppercase">
            Total XP
          </p>
          <p className="font-tele text-xl text-ink-100">{totalXP}</p>
        </div>
        <div>
          <p className="mb-1 text-xs font-medium tracking-wide text-ink-500 uppercase">
            {mascot.stage.name}
          </p>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-telemetry-400"
              style={{ width: `${mascot.pct}%` }}
            />
          </div>
        </div>
      </div>

      {fastestLap && (
        <div className="mt-5 flex items-center gap-2 border-t border-white/5 pt-4 text-xs text-amber-300">
          <Trophy className="h-4 w-4" />
          <span className="font-tele">
            Fastest Lap this week: {fastestLap.date} (
            {fastestLap.ratio.toFixed(1)}:1)
          </span>
        </div>
      )}
    </GlassCard>
  );
}
