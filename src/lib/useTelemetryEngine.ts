import { useLiveQuery } from "dexie-react-hooks";
import db, { shiftDateKey, todayKey } from "./db";
import {
  comboMultiplier,
  comboStreak,
  computeDayXP,
  fastestLapDay,
  isBlackFlagActive,
  isSlipstreamActive,
  mascotProgress,
  pastSelfBest,
  rivalScale,
  rivalTarget,
  SLIPSTREAM_MULTIPLIER,
  totalProductiveHours,
  type FastestLap,
} from "./gamification";
import type { DailyLog } from "./types";

export interface TelemetryEngine {
  today: string;
  todayLog: DailyLog | null;
  todayHours: number;
  pastBest: number;
  rival: number;
  streak: number;
  multiplier: number;
  slipstream: boolean;
  blackFlag: boolean;
  todayXP: number;
  totalXP: number;
  mascot: ReturnType<typeof mascotProgress>;
  fastestLap: FastestLap | null;
}

export function useTelemetryEngine(): TelemetryEngine | null {
  const today = todayKey();
  const from = shiftDateKey(today, -7);

  const windowLogs = useLiveQuery(
    () => db.dailyLogs.where("date").between(from, today, true, true).toArray(),
    [from, today],
  );
  const windowTrackers = useLiveQuery(
    () =>
      db.customTrackers.where("date").between(from, today, true, true).toArray(),
    [from, today],
  );
  const allLogs = useLiveQuery(() => db.dailyLogs.toArray(), []);
  const allTrackers = useLiveQuery(() => db.customTrackers.toArray(), []);

  if (!windowLogs || !windowTrackers || !allLogs || !allTrackers) {
    return null;
  }

  const logsByDate = new Map(windowLogs.map((l) => [l.date, l]));
  const todayLog = logsByDate.get(today) ?? null;
  const pastLogs = windowLogs.filter((l) => l.date !== today);

  const streak = comboStreak(today, logsByDate);
  const multiplier = comboMultiplier(streak);
  const slipstream = isSlipstreamActive(today, logsByDate);
  const blackFlag = isBlackFlagActive(today, logsByDate);
  const scale = rivalScale(today, logsByDate);

  const todayHours = todayLog ? totalProductiveHours(todayLog, windowTrackers) : 0;
  const pastBest = pastSelfBest(pastLogs, windowTrackers);
  const rival = rivalTarget(pastLogs, windowTrackers, scale);

  const todayBaseXP = todayLog ? computeDayXP(todayLog, windowTrackers) : 0;
  const todayXP = Math.round(
    todayBaseXP * multiplier * (slipstream ? SLIPSTREAM_MULTIPLIER : 1),
  );

  const totalXP = allLogs.reduce(
    (sum, l) => sum + computeDayXP(l, allTrackers),
    0,
  );

  const fastestLap = fastestLapDay(pastLogs, windowTrackers);

  return {
    today,
    todayLog,
    todayHours,
    pastBest,
    rival,
    streak,
    multiplier,
    slipstream,
    blackFlag,
    todayXP,
    totalXP,
    mascot: mascotProgress(totalXP),
    fastestLap,
  };
}
