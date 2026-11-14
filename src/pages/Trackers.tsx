import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { ListChecks, Plus, Trash2 } from "lucide-react";
import { clsx } from "clsx";
import db, { todayKey } from "../lib/db";
import { GlassCard } from "../components/GlassCard";
import { NumberField } from "../components/NumberField";
import { WeightTrendChart } from "../components/charts/WeightTrendChart";
import { HoursBreakdownChart } from "../components/charts/HoursBreakdownChart";
import type { ActivityTag } from "../lib/types";

export function Trackers() {
  const date = todayKey();
  const entries = useLiveQuery(
    () =>
      db.customTrackers
        .where("date")
        .equals(date)
        .toArray()
        .then((rows) => rows.sort((a, b) => b.createdAt - a.createdAt)),
    [date],
  );

  const [label, setLabel] = useState("");
  const [hours, setHours] = useState<number | undefined>(undefined);
  const [tag, setTag] = useState<ActivityTag>("productive");
  const [notes, setNotes] = useState("");

  const addEntry = async () => {
    if (!label.trim() || !hours) return;
    await db.customTrackers.add({
      date,
      label: label.trim(),
      hours,
      tag,
      notes: notes.trim() || undefined,
      createdAt: Date.now(),
    });
    setLabel("");
    setHours(undefined);
    setNotes("");
  };

  const removeEntry = async (id: number) => {
    await db.customTrackers.delete(id);
  };

  return (
    <div className="flex flex-col gap-4">
      <GlassCard className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <ListChecks className="h-5 w-5 text-ink-500" />
          <h2 className="text-lg font-semibold text-ink-100">
            Custom Tracker
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-[2fr_1fr_1fr]">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium tracking-wide text-ink-500 uppercase">
              Activity
            </span>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Guitar practice"
              className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-2.5 text-sm text-ink-100 outline-none focus:border-telemetry-500/50"
            />
          </label>

          <NumberField
            label="Hours"
            suffix="hrs"
            step={0.25}
            value={hours}
            onChange={setHours}
          />

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium tracking-wide text-ink-500 uppercase">
              Tag
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTag("productive")}
                className={clsx(
                  "flex-1 rounded-xl border px-3 py-2.5 text-xs font-medium transition-colors",
                  tag === "productive"
                    ? "border-streak-500/40 bg-streak-500/10 text-streak-300 glow-streak"
                    : "border-white/5 bg-white/[0.02] text-ink-500",
                )}
              >
                Productive
              </button>
              <button
                type="button"
                onClick={() => setTag("unproductive")}
                className={clsx(
                  "flex-1 rounded-xl border px-3 py-2.5 text-xs font-medium transition-colors",
                  tag === "unproductive"
                    ? "border-throttle-500/40 bg-throttle-500/10 text-throttle-300 glow-throttle"
                    : "border-white/5 bg-white/[0.02] text-ink-500",
                )}
              >
                Unproductive
              </button>
            </div>
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes (optional)"
            className="flex-1 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-2.5 text-sm text-ink-100 outline-none focus:border-telemetry-500/50"
          />
          <button
            type="button"
            onClick={addEntry}
            disabled={!label.trim() || !hours}
            className="flex items-center gap-1.5 rounded-xl border border-telemetry-400/30 bg-telemetry-500/10 px-4 py-2.5 text-sm font-medium text-telemetry-300 transition-opacity hover:bg-telemetry-500/20 disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
            Log it
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-2">
          {entries && entries.length > 0 ? (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={clsx(
                      "h-2 w-2 shrink-0 rounded-full",
                      entry.tag === "productive"
                        ? "bg-streak-500"
                        : "bg-throttle-500",
                    )}
                  />
                  <div>
                    <p className="text-sm font-medium text-ink-100">
                      {entry.label}
                    </p>
                    {entry.notes && (
                      <p className="text-xs text-ink-700">{entry.notes}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-tele text-sm text-ink-300">
                    {entry.hours}h
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      entry.id !== undefined && removeEntry(entry.id)
                    }
                    className="rounded-md p-1.5 text-ink-700 hover:bg-white/5 hover:text-throttle-400"
                    aria-label="Delete entry"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="font-tele text-xs text-ink-700">
              No custom activity logged today.
            </p>
          )}
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <WeightTrendChart />
        <HoursBreakdownChart />
      </div>
    </div>
  );
}
