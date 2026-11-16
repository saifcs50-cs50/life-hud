import { useEffect, useRef } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import db from "./db";
import { useTelemetryEngine, type TelemetryEngine } from "./useTelemetryEngine";

interface Milestone {
  title: string;
  description: string;
  icon: string;
  condition: (t: TelemetryEngine) => boolean;
}

const MILESTONES: Milestone[] = [
  {
    title: "First Combo",
    description: "Hit every non-negotiable in a single day.",
    icon: "flag",
    condition: (t) => t.streak >= 1,
  },
  {
    title: "On a Roll",
    description: "Reached a 3-day combo streak.",
    icon: "flame",
    condition: (t) => t.streak >= 3,
  },
  {
    title: "Slipstream Unlocked",
    description: "3 consecutive productive days. 1.5x XP drafting active.",
    icon: "wind",
    condition: (t) => t.slipstream,
  },
  {
    title: "Century Club",
    description: "Crossed 100 career XP.",
    icon: "star",
    condition: (t) => t.totalXP >= 100,
  },
  {
    title: "Contender",
    description: "Companion evolved to Stage 2.",
    icon: "trophy",
    condition: (t) => t.mascot.stage.stage >= 2,
  },
  {
    title: "Champion",
    description: "Companion evolved to Stage 3.",
    icon: "crown",
    condition: (t) => t.mascot.stage.stage >= 3,
  },
];

/** Evaluates milestone conditions against live telemetry and writes newly-earned trophies once. */
export function useTrophyAutoUnlock() {
  const telemetry = useTelemetryEngine();
  const telemetryRef = useRef(telemetry);
  telemetryRef.current = telemetry;

  const streak = telemetry?.streak;
  const slipstream = telemetry?.slipstream;
  const totalXP = telemetry?.totalXP;
  const stage = telemetry?.mascot.stage.stage;

  useEffect(() => {
    const t = telemetryRef.current;
    if (!t) return;

    (async () => {
      const existing = await db.trophies.toArray();
      const existingTitles = new Set(existing.map((row) => row.title));

      for (const milestone of MILESTONES) {
        if (!milestone.condition(t)) continue;
        if (existingTitles.has(milestone.title)) continue;
        await db.trophies.add({
          title: milestone.title,
          description: milestone.description,
          icon: milestone.icon,
          unlockedAt: Date.now(),
        });
        existingTitles.add(milestone.title);
      }
    })();
  }, [streak, slipstream, totalXP, stage]);

  const bossFights = useLiveQuery(() => db.bossFights.toArray(), []);
  const bossSlain = bossFights?.some(
    (f) => f.hoursLogged >= f.totalHoursRequired,
  );

  useEffect(() => {
    if (!bossSlain) return;
    (async () => {
      const already = await db.trophies
        .toArray()
        .then((rows) => rows.some((row) => row.title === "Boss Slain"));
      if (already) return;
      await db.trophies.add({
        title: "Boss Slain",
        description: "Defeated your first Boss Fight: exam prep goal fully logged.",
        icon: "swords",
        unlockedAt: Date.now(),
      });
    })();
  }, [bossSlain]);
}
