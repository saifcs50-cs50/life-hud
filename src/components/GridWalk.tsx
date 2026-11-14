import { clsx } from "clsx";
import { GlassCard } from "./GlassCard";
import { useDailyLogStore } from "../store/dailyLogStore";
import type { DailyLog } from "../lib/types";

function isMorningRoutineDone(log: DailyLog): boolean {
  const m = log.skincareMorning;
  return m.cleanse && m.treat && m.hydrate;
}

export function GridWalk() {
  const log = useDailyLogStore((s) => s.log);

  if (!log) return null;

  const checks = [
    !!log.betterThanYesterday,
    (log.hydrationGlasses ?? 0) >= 1,
    !!log.workoutDone,
    isMorningRoutineDone(log),
    !!log.journaled,
  ];

  const litCount = checks.filter((done) => !done).length;
  const allClear = litCount === 0;

  return (
    <GlassCard className="flex items-center justify-between gap-4 p-6">
      <div>
        <h2 className="text-lg font-semibold text-ink-100">Grid Walk</h2>
        <p className="font-tele text-xs text-ink-700">
          {allClear
            ? "LIGHTS OUT — GO RACING"
            : `${litCount} LIGHT${litCount === 1 ? "" : "S"} REMAINING`}
        </p>
      </div>
      <div className="flex gap-2.5">
        {checks.map((done, i) => (
          <span
            key={i}
            className={clsx(
              "h-5 w-5 rounded-full border transition-all duration-500",
              done
                ? "border-white/10 bg-white/5"
                : "glow-throttle border-throttle-500/60 bg-throttle-500",
            )}
          />
        ))}
      </div>
    </GlassCard>
  );
}
