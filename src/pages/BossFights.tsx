import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Swords, Plus, Trash2, Skull } from "lucide-react";
import { clsx } from "clsx";
import db from "../lib/db";
import { GlassCard } from "../components/GlassCard";
import { NumberField } from "../components/NumberField";
import type { BossFight } from "../lib/types";

function healthPct(fight: BossFight): number {
  if (fight.totalHoursRequired <= 0) return 0;
  const pct = 100 - (fight.hoursLogged / fight.totalHoursRequired) * 100;
  return Math.max(0, Math.min(100, pct));
}

function formatExamDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function BossCard({ fight }: { fight: BossFight }) {
  const [delta, setDelta] = useState<number | undefined>(undefined);
  const defeated = fight.hoursLogged >= fight.totalHoursRequired;
  const hp = healthPct(fight);
  const daysLeft = Math.ceil(
    (new Date(`${fight.examDate}T00:00:00`).getTime() - Date.now()) / 86_400_000,
  );

  const logHours = async () => {
    if (!delta || fight.id === undefined) return;
    await db.bossFights.update(fight.id, {
      hoursLogged: fight.hoursLogged + delta,
    });
    setDelta(undefined);
  };

  const remove = async () => {
    if (fight.id !== undefined) await db.bossFights.delete(fight.id);
  };

  return (
    <GlassCard className="flex flex-col gap-3 p-6">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-ink-100">
            {fight.subject}
          </h3>
          <p className="font-tele text-xs text-ink-700">
            {formatExamDate(fight.examDate)}
            {!defeated &&
              (daysLeft >= 0 ? ` · ${daysLeft}d left` : " · overdue")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {defeated && (
            <span className="flex items-center gap-1 rounded-full border border-streak-500/40 bg-streak-500/10 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-streak-300">
              <Skull className="h-3 w-3" /> DEFEATED
            </span>
          )}
          <button
            type="button"
            onClick={remove}
            className="rounded-md p-1.5 text-ink-700 hover:bg-white/5 hover:text-throttle-400"
            aria-label="Delete boss fight"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="relative h-3 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className={clsx(
            "h-full rounded-full transition-all duration-500",
            defeated
              ? "bg-ink-700"
              : hp < 30
                ? "bg-throttle-500"
                : "bg-streak-500",
          )}
          style={{ width: `${defeated ? 100 : hp}%` }}
        />
      </div>
      <p className="font-tele text-xs text-ink-500">
        {fight.hoursLogged.toFixed(1)} / {fight.totalHoursRequired}h logged
      </p>

      {!defeated && (
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <NumberField
              label="Log hours"
              step={0.5}
              value={delta}
              onChange={setDelta}
            />
          </div>
          <button
            type="button"
            onClick={logHours}
            disabled={!delta}
            className="flex items-center gap-1.5 rounded-xl border border-telemetry-400/30 bg-telemetry-500/10 px-3 py-2.5 text-xs font-medium text-telemetry-300 transition-opacity hover:bg-telemetry-500/20 disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5" /> Log
          </button>
        </div>
      )}
    </GlassCard>
  );
}

export function BossFights() {
  const fights = useLiveQuery(() => db.bossFights.toArray(), []);

  const [subject, setSubject] = useState("");
  const [examDate, setExamDate] = useState("");
  const [totalHours, setTotalHours] = useState<number | undefined>(undefined);

  const addFight = async () => {
    if (!subject.trim() || !examDate || !totalHours) return;
    await db.bossFights.add({
      subject: subject.trim(),
      examDate,
      totalHoursRequired: totalHours,
      hoursLogged: 0,
      createdAt: Date.now(),
    });
    setSubject("");
    setExamDate("");
    setTotalHours(undefined);
  };

  const sorted = [...(fights ?? [])].sort((a, b) => {
    const aDefeated = a.hoursLogged >= a.totalHoursRequired;
    const bDefeated = b.hoursLogged >= b.totalHoursRequired;
    if (aDefeated !== bDefeated) return aDefeated ? 1 : -1;
    return a.examDate < b.examDate ? -1 : 1;
  });

  return (
    <div className="flex flex-col gap-4">
      <GlassCard className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <Swords className="h-5 w-5 text-ink-500" />
          <h2 className="text-lg font-semibold text-ink-100">
            New Boss Fight
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[2fr_1fr_1fr_auto]">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium tracking-wide text-ink-500 uppercase">
              Subject
            </span>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Organic Chemistry Final"
              className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-2.5 text-sm text-ink-100 outline-none focus:border-telemetry-500/50"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium tracking-wide text-ink-500 uppercase">
              Exam Date
            </span>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="font-tele rounded-xl border border-white/5 bg-white/[0.02] px-4 py-2.5 text-sm text-ink-100 outline-none focus:border-telemetry-500/50"
            />
          </label>
          <NumberField
            label="Hours Needed"
            step={1}
            value={totalHours}
            onChange={setTotalHours}
          />
          <button
            type="button"
            onClick={addFight}
            disabled={!subject.trim() || !examDate || !totalHours}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-telemetry-400/30 bg-telemetry-500/10 px-4 py-2.5 text-sm font-medium text-telemetry-300 transition-opacity hover:bg-telemetry-500/20 disabled:opacity-40 md:self-end"
          >
            <Plus className="h-4 w-4" />
            Add exam
          </button>
        </div>
      </GlassCard>

      {sorted.length === 0 ? (
        <GlassCard className="flex min-h-[30vh] flex-col items-center justify-center gap-3 p-6 text-center">
          <Swords className="h-8 w-8 text-ink-700" strokeWidth={1.5} />
          <p className="text-sm text-ink-500">No exams yet. Add one above.</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sorted.map((fight) => (
            <BossCard key={fight.id} fight={fight} />
          ))}
        </div>
      )}
    </div>
  );
}
