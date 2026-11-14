import { useEffect, useState } from "react";
import { GlassCard } from "../components/GlassCard";
import { Toggle } from "../components/Toggle";
import { NumberField } from "../components/NumberField";
import { ChecklistPills } from "../components/ChecklistPills";
import { RatingDots } from "../components/RatingDots";
import { WaterGauge } from "../components/WaterGauge";
import { BrainDumpBoard } from "../components/BrainDumpBoard";
import { RaceControl } from "../components/RaceControl";
import { GridWalk } from "../components/GridWalk";
import { CompanionCard } from "../components/CompanionCard";
import { TireWearCard } from "../components/TireWearCard";
import { TodaySplitChart } from "../components/charts/TodaySplitChart";
import { XPTrendChart } from "../components/charts/XPTrendChart";
import { useDailyLogStore } from "../store/dailyLogStore";
import type { SkincareChecklist } from "../lib/types";

const SKINCARE_AM_ITEMS = [
  { key: "cleanse", label: "Cleanse" },
  { key: "treat", label: "Treat" },
  { key: "hydrate", label: "Hydrate" },
  { key: "protect", label: "Protect (SPF)" },
  { key: "omega3", label: "Omega-3" },
];

const SKINCARE_PM_ITEMS = [
  { key: "cleanse", label: "Cleanse" },
  { key: "treat", label: "Treat" },
  { key: "hydrate", label: "Hydrate" },
];

const NON_NEGOTIABLE_ITEMS = [
  { key: "workoutDone", label: "Workout" },
  { key: "readingDone", label: "Reading 20m+" },
  { key: "journaled", label: "Journaled" },
  { key: "ateClean", label: "Ate clean" },
];

export function Dashboard() {
  const { log, status, update } = useDailyLogStore();

  const [notesDraft, setNotesDraft] = useState("");

  useEffect(() => {
    setNotesDraft(log?.notes ?? "");
  }, [log?.date]);

  if (status === "idle" || status === "loading" || !log) {
    return (
      <GlassCard className="flex h-64 items-center justify-center">
        <p className="font-tele text-sm text-ink-700">
          INITIALIZING TELEMETRY…
        </p>
      </GlassCard>
    );
  }

  if (status === "error") {
    return (
      <GlassCard
        glow="throttle"
        className="flex h-64 items-center justify-center"
      >
        <p className="font-tele text-sm text-throttle-400">
          DATA LINK ERROR
        </p>
      </GlassCard>
    );
  }

  const toggleSkincare = (
    slot: "skincareMorning" | "skincareEvening",
    key: string,
  ) => {
    const current = log[slot];
    update({
      [slot]: {
        ...current,
        [key]: !current[key as keyof SkincareChecklist],
      },
    });
  };

  const toggleNonNegotiable = (key: string) => {
    const field = key as
      | "workoutDone"
      | "readingDone"
      | "journaled"
      | "ateClean";
    update({ [field]: !log[field] });
  };

  return (
    <div className="flex flex-col gap-4">
      <RaceControl />
      <GridWalk />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <TodaySplitChart />
        <XPTrendChart />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <CompanionCard />
        <TireWearCard />

        <GlassCard className="flex flex-col gap-3 p-6">
          <h2 className="text-lg font-semibold text-ink-100">Vitals</h2>
          <NumberField
            label="Weight"
            suffix="kg"
            value={log.weight}
            onChange={(v) => update({ weight: v })}
          />
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium tracking-wide text-ink-500 uppercase">
              Skin condition
            </span>
            <RatingDots
              value={log.skinRating}
              onChange={(v) => update({ skinRating: v })}
            />
          </div>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium tracking-wide text-ink-500 uppercase">
              Notes
            </span>
            <textarea
              rows={2}
              value={notesDraft}
              onChange={(e) => setNotesDraft(e.target.value)}
              onBlur={() => update({ notes: notesDraft })}
              className="resize-none rounded-xl border border-white/5 bg-white/[0.02] px-4 py-2.5 text-sm text-ink-100 outline-none focus:border-telemetry-500/50"
            />
          </label>
        </GlassCard>

        <GlassCard className="flex flex-col gap-3 p-6">
          <h2 className="text-lg font-semibold text-ink-100">1% Better</h2>
          <Toggle
            label="Better than yesterday?"
            checked={!!log.betterThanYesterday}
            onChange={(checked) => update({ betterThanYesterday: checked })}
          />
          {log.betterThanYesterday && (
            <input
              type="text"
              value={log.betterHow ?? ""}
              onChange={(e) => update({ betterHow: e.target.value })}
              placeholder="How?"
              className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-2.5 text-sm text-ink-100 outline-none focus:border-telemetry-500/50"
            />
          )}
        </GlassCard>

        <GlassCard className="flex flex-col gap-3 p-6">
          <h2 className="text-lg font-semibold text-ink-100">
            Non-Negotiables
          </h2>
          <ChecklistPills
            items={NON_NEGOTIABLE_ITEMS}
            values={{
              workoutDone: !!log.workoutDone,
              readingDone: !!log.readingDone,
              journaled: !!log.journaled,
              ateClean: !!log.ateClean,
            }}
            onToggle={toggleNonNegotiable}
          />
        </GlassCard>

        <GlassCard className="flex flex-col gap-3 p-6">
          <h2 className="text-lg font-semibold text-ink-100">
            Skincare Routine
          </h2>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium tracking-wide text-ink-500 uppercase">
              Morning
            </span>
            <ChecklistPills
              items={SKINCARE_AM_ITEMS}
              values={{ ...log.skincareMorning }}
              onToggle={(key) => toggleSkincare("skincareMorning", key)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium tracking-wide text-ink-500 uppercase">
              Evening
            </span>
            <ChecklistPills
              items={SKINCARE_PM_ITEMS}
              values={{ ...log.skincareEvening }}
              onToggle={(key) => toggleSkincare("skincareEvening", key)}
            />
          </div>
        </GlassCard>

        <GlassCard blur={false} className="flex flex-col gap-3 p-6">
          <h2 className="text-lg font-semibold text-ink-100">Hydration</h2>
          <WaterGauge
            glasses={log.hydrationGlasses ?? 0}
            onChange={(v) => update({ hydrationGlasses: v })}
          />
        </GlassCard>

        <GlassCard className="flex flex-col gap-3 p-6">
          <h2 className="text-lg font-semibold text-ink-100">
            Structured Time
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <NumberField
              label="Study"
              suffix="hrs"
              value={log.studyHours}
              onChange={(v) => update({ studyHours: v })}
            />
            <NumberField
              label="YouTube"
              suffix="hrs"
              value={log.youtubeHours}
              onChange={(v) => update({ youtubeHours: v })}
            />
            <NumberField
              label="Instagram"
              suffix="hrs"
              value={log.instagramHours}
              onChange={(v) => update({ instagramHours: v })}
            />
            <NumberField
              label="Web Series"
              suffix="hrs"
              value={log.webSeriesHours}
              onChange={(v) => update({ webSeriesHours: v })}
            />
          </div>
        </GlassCard>

        <GlassCard className="flex flex-col gap-3 p-6">
          <h2 className="text-lg font-semibold text-ink-100">After Hours</h2>
          <NumberField
            label="Late-night deep work"
            suffix="min"
            step={5}
            value={log.afterHoursMinutes}
            onChange={(v) => update({ afterHoursMinutes: v })}
          />
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-ink-100">
            System Status
          </h2>
          <dl className="font-tele grid grid-cols-2 gap-y-3 text-sm">
            <dt className="text-ink-700">Log date</dt>
            <dd className="text-right text-ink-300">{log.date}</dd>

            <dt className="text-ink-700">Last write</dt>
            <dd className="text-right text-ink-300">
              {new Date(log.updatedAt).toLocaleTimeString()}
            </dd>

            <dt className="text-ink-700">Storage</dt>
            <dd className="text-right text-streak-400">IndexedDB · Dexie</dd>
          </dl>
        </GlassCard>
      </div>

      <BrainDumpBoard />
    </div>
  );
}
