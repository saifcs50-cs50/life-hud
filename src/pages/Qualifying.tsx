import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Flag, Plus, Trash2 } from "lucide-react";
import db, { todayKey } from "../lib/db";
import { GlassCard } from "../components/GlassCard";
import { NumberField } from "../components/NumberField";
import { Toggle } from "../components/Toggle";
import { qualifyingWeekStart } from "../lib/gamification";

export function Qualifying() {
  const weekStart = qualifyingWeekStart(todayKey());

  const targets = useLiveQuery(
    () => db.qualifyingTargets.where("weekStart").equals(weekStart).toArray(),
    [weekStart],
  );

  const [label, setLabel] = useState("");
  const [targetHours, setTargetHours] = useState<number | undefined>(
    undefined,
  );

  const addTarget = async () => {
    if (!label.trim() || !targetHours) return;
    await db.qualifyingTargets.add({
      weekStart,
      label: label.trim(),
      targetHours,
      achieved: false,
    });
    setLabel("");
    setTargetHours(undefined);
  };

  const setAchieved = async (id: number, achieved: boolean) => {
    await db.qualifyingTargets.update(id, { achieved });
  };

  const removeTarget = async (id: number) => {
    await db.qualifyingTargets.delete(id);
  };

  const achievedCount = targets?.filter((t) => t.achieved).length ?? 0;
  const totalCount = targets?.length ?? 0;

  const weekLabel = new Date(`${weekStart}T00:00:00`).toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric" },
  );

  return (
    <div className="flex flex-col gap-4">
      <GlassCard className="flex flex-wrap items-center justify-between gap-4 p-6">
        <div className="flex items-center gap-3">
          <Flag className="h-5 w-5 text-ink-500" />
          <div>
            <h2 className="text-lg font-semibold text-ink-100">
              Qualifying · week of {weekLabel}
            </h2>
            <p className="text-sm text-ink-500">
              Set your grid for the week ahead.
            </p>
          </div>
        </div>
        <p className="font-tele text-xl text-ink-100">
          {achievedCount}/{totalCount}
          <span className="ml-1.5 text-xs text-ink-700">HIT</span>
        </p>
      </GlassCard>

      <GlassCard className="p-6">
        <h3 className="mb-4 text-sm font-semibold text-ink-100">Set a Target</h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[2fr_1fr_auto]">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium tracking-wide text-ink-500 uppercase">
              Target
            </span>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Physics revision"
              className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-2.5 text-sm text-ink-100 outline-none focus:border-telemetry-500/50"
            />
          </label>
          <NumberField
            label="Target Hours"
            step={0.5}
            value={targetHours}
            onChange={setTargetHours}
          />
          <button
            type="button"
            onClick={addTarget}
            disabled={!label.trim() || !targetHours}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-telemetry-400/30 bg-telemetry-500/10 px-4 py-2.5 text-sm font-medium text-telemetry-300 transition-opacity hover:bg-telemetry-500/20 disabled:opacity-40 md:self-end"
          >
            <Plus className="h-4 w-4" />
            Set
          </button>
        </div>
      </GlassCard>

      {targets && targets.length > 0 ? (
        <div className="flex flex-col gap-3">
          {targets.map((t) => (
            <GlassCard key={t.id} className="flex items-center gap-3 p-4">
              <div className="flex-1">
                <Toggle
                  label={`${t.label} · ${t.targetHours}h`}
                  checked={t.achieved}
                  onChange={(next) =>
                    t.id !== undefined && setAchieved(t.id, next)
                  }
                />
              </div>
              <button
                type="button"
                onClick={() => t.id !== undefined && removeTarget(t.id)}
                className="rounded-md p-1.5 text-ink-700 hover:bg-white/5 hover:text-throttle-400"
                aria-label="Delete target"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </GlassCard>
          ))}
        </div>
      ) : (
        <GlassCard className="flex min-h-[20vh] flex-col items-center justify-center gap-3 p-6 text-center">
          <Flag className="h-8 w-8 text-ink-700" strokeWidth={1.5} />
          <p className="text-sm text-ink-500">No targets set for this week.</p>
        </GlassCard>
      )}
    </div>
  );
}
