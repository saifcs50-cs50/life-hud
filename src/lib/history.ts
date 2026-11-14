import { useLiveQuery } from "dexie-react-hooks";
import db, { shiftDateKey, todayKey } from "./db";
import { computeDayXP } from "./gamification";
import type { DailyLog } from "./types";

/** Daily logs for the trailing `days` window, oldest first. */
export function useRecentLogs(days: number): DailyLog[] | undefined {
  return useLiveQuery(async () => {
    const from = shiftDateKey(todayKey(), -(days - 1));
    const to = todayKey();
    const rows = await db.dailyLogs
      .where("date")
      .between(from, to, true, true)
      .toArray();
    return rows.sort((a, b) => (a.date < b.date ? -1 : 1));
  }, [days]);
}

export interface XPTrendPoint {
  date: string;
  xp: number;
}

/** Unmultiplied daily XP (matches the "Total XP" definition) for the trailing `days` window, oldest first. */
export function useXPTrend(days: number): XPTrendPoint[] | undefined {
  return useLiveQuery(async () => {
    const from = shiftDateKey(todayKey(), -(days - 1));
    const to = todayKey();
    const [logs, trackers] = await Promise.all([
      db.dailyLogs.where("date").between(from, to, true, true).toArray(),
      db.customTrackers.where("date").between(from, to, true, true).toArray(),
    ]);
    const logsByDate = new Map(logs.map((l) => [l.date, l]));

    const points: XPTrendPoint[] = [];
    for (let i = 0; i < days; i++) {
      const date = shiftDateKey(from, i);
      const log = logsByDate.get(date);
      points.push({
        date: date.slice(5),
        xp: log ? computeDayXP(log, trackers) : 0,
      });
    }
    return points;
  }, [days]);
}
