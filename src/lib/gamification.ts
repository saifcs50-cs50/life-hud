import { shiftDateKey } from "./db";
import type { CustomTrackerEntry, DailyLog, SkincareChecklist } from "./types";

export const XP_VALUES = {
  nonNegotiable: 10,
  skincareRoutine: 5,
  betterThanYesterday: 5,
  studyHour: 15,
  productiveTrackerHour: 15,
  hydrationGoal: 5,
} as const;

export const HYDRATION_GOAL = 8;
export const COMBO_MAX_STREAK_BONUS = 10;
export const COMBO_BONUS_PER_DAY = 0.05;
export const SLIPSTREAM_MULTIPLIER = 1.5;
export const RIVAL_BASE_SCALE = 1.075;
export const RIVAL_BLACK_FLAG_SCALE = 1.2;

export const MASCOT_STAGES = [
  { stage: 1, name: "Rookie", minXP: 0 },
  { stage: 2, name: "Contender", minXP: 1500 },
  { stage: 3, name: "Champion", minXP: 5000 },
] as const;

export const TIRE_WEAR_THRESHOLD_HOURS = 6;
export const TIRE_RECOVERY_PER_PITSTOP = 25;

/** 0-100. Proxy for focus-block fatigue. No live session timer exists, so this derives from logged load. */
export function computeGripPct(log: DailyLog): number {
  const load = (log.studyHours ?? 0) + (log.afterHoursMinutes ?? 0) / 60;
  const rawWear = Math.min(100, (load / TIRE_WEAR_THRESHOLD_HOURS) * 100);
  const pitStops = log.pitStops ?? 0;
  const wearPct = Math.max(0, rawWear - pitStops * TIRE_RECOVERY_PER_PITSTOP);
  return 100 - wearPct;
}

export type WeatherState = "thermal" | "stormy" | "clear" | "neutral";

export function computeWeather(params: {
  streak: number;
  slipstream: boolean;
  blackFlag: boolean;
  gripPct: number;
}): WeatherState {
  if (params.gripPct < 20) return "thermal";
  if (params.blackFlag) return "stormy";
  if (params.slipstream || params.streak >= 3) return "clear";
  return "neutral";
}

function isFullChecklist(c: SkincareChecklist): boolean {
  return c.cleanse && c.treat && c.hydrate;
}

export function productiveTrackerHours(
  date: string,
  trackers: CustomTrackerEntry[],
): number {
  return trackers
    .filter((t) => t.date === date && t.tag === "productive")
    .reduce((sum, t) => sum + t.hours, 0);
}

export function unproductiveTrackerHours(
  date: string,
  trackers: CustomTrackerEntry[],
): number {
  return trackers
    .filter((t) => t.date === date && t.tag === "unproductive")
    .reduce((sum, t) => sum + t.hours, 0);
}

export function totalProductiveHours(
  log: DailyLog,
  trackers: CustomTrackerEntry[],
): number {
  return (log.studyHours ?? 0) + productiveTrackerHours(log.date, trackers);
}

export function totalUnproductiveHours(
  log: DailyLog,
  trackers: CustomTrackerEntry[],
): number {
  return (
    (log.youtubeHours ?? 0) +
    (log.instagramHours ?? 0) +
    (log.webSeriesHours ?? 0) +
    unproductiveTrackerHours(log.date, trackers)
  );
}

export function isComboMet(log: DailyLog): boolean {
  return !!(
    log.workoutDone &&
    log.readingDone &&
    log.journaled &&
    log.ateClean
  );
}

export function computeDayXP(
  log: DailyLog,
  trackers: CustomTrackerEntry[],
): number {
  let xp = 0;
  if (log.workoutDone) xp += XP_VALUES.nonNegotiable;
  if (log.readingDone) xp += XP_VALUES.nonNegotiable;
  if (log.journaled) xp += XP_VALUES.nonNegotiable;
  if (log.ateClean) xp += XP_VALUES.nonNegotiable;
  if (isFullChecklist(log.skincareMorning)) xp += XP_VALUES.skincareRoutine;
  if (isFullChecklist(log.skincareEvening)) xp += XP_VALUES.skincareRoutine;
  if (log.betterThanYesterday) xp += XP_VALUES.betterThanYesterday;
  if ((log.hydrationGlasses ?? 0) >= HYDRATION_GOAL) xp += XP_VALUES.hydrationGoal;

  const drsMultiplier = log.drsActive ? 2 : 1;
  xp += (log.studyHours ?? 0) * XP_VALUES.studyHour * drsMultiplier;
  xp += productiveTrackerHours(log.date, trackers) * XP_VALUES.productiveTrackerHour;

  return Math.round(xp);
}

/** Consecutive combo-met days walking backward from `today`, stopping at the first gap or miss. */
export function comboStreak(
  today: string,
  logsByDate: Map<string, DailyLog>,
): number {
  let streak = 0;
  let cursor = today;
  while (true) {
    const log = logsByDate.get(cursor);
    if (!log || !isComboMet(log)) break;
    streak++;
    cursor = shiftDateKey(cursor, -1);
  }
  return streak;
}

export function comboMultiplier(streak: number): number {
  return 1 + Math.min(streak, COMBO_MAX_STREAK_BONUS) * COMBO_BONUS_PER_DAY;
}

/** 3 consecutive combo days ending today (today included). */
export function isSlipstreamActive(
  today: string,
  logsByDate: Map<string, DailyLog>,
): boolean {
  for (let i = 0; i < 3; i++) {
    const log = logsByDate.get(shiftDateKey(today, -i));
    if (!log || !isComboMet(log)) return false;
  }
  return true;
}

/** 3 consecutive missed-combo days ending yesterday (today excluded, still in progress). */
export function isBlackFlagActive(
  today: string,
  logsByDate: Map<string, DailyLog>,
): boolean {
  for (let i = 1; i <= 3; i++) {
    const log = logsByDate.get(shiftDateKey(today, -i));
    if (!log || isComboMet(log)) return false;
  }
  return true;
}

export function rivalScale(
  today: string,
  logsByDate: Map<string, DailyLog>,
): number {
  return isBlackFlagActive(today, logsByDate)
    ? RIVAL_BLACK_FLAG_SCALE
    : RIVAL_BASE_SCALE;
}

export function pastSelfBest(
  pastLogs: DailyLog[],
  trackers: CustomTrackerEntry[],
): number {
  return pastLogs.reduce(
    (max, l) => Math.max(max, totalProductiveHours(l, trackers)),
    0,
  );
}

export function rivalTarget(
  pastLogs: DailyLog[],
  trackers: CustomTrackerEntry[],
  scale: number,
): number {
  if (pastLogs.length === 0) return 0;
  const avg =
    pastLogs.reduce((sum, l) => sum + totalProductiveHours(l, trackers), 0) /
    pastLogs.length;
  return avg * scale;
}

export interface FastestLap {
  date: string;
  ratio: number;
}

export function fastestLapDay(
  pastLogs: DailyLog[],
  trackers: CustomTrackerEntry[],
): FastestLap | null {
  let best: FastestLap | null = null;
  for (const log of pastLogs) {
    const prod = totalProductiveHours(log, trackers);
    if (prod <= 0) continue;
    const unprod = totalUnproductiveHours(log, trackers);
    const ratio = prod / Math.max(unprod, 0.1);
    if (!best || ratio > best.ratio) best = { date: log.date, ratio };
  }
  return best;
}

/**
 * Monday of the week Qualifying targets apply to. On weekdays that's the
 * current week (mid-week check-in); on Sat/Sun it rolls to next Monday,
 * matching the "set your grid on Saturday for the week ahead" ritual.
 */
export function qualifyingWeekStart(today: string): string {
  const dow = new Date(`${today}T00:00:00`).getDay(); // 0 Sun - 6 Sat
  if (dow === 0) return shiftDateKey(today, 1);
  if (dow === 6) return shiftDateKey(today, 2);
  return shiftDateKey(today, -(dow - 1));
}

export function mascotStageFor(totalXP: number) {
  let current: (typeof MASCOT_STAGES)[number] = MASCOT_STAGES[0];
  for (const s of MASCOT_STAGES) {
    if (totalXP >= s.minXP) current = s;
  }
  return current;
}

export function mascotProgress(totalXP: number): {
  stage: (typeof MASCOT_STAGES)[number];
  next: (typeof MASCOT_STAGES)[number] | null;
  pct: number;
} {
  const stage = mascotStageFor(totalXP);
  const idx = MASCOT_STAGES.findIndex((s) => s.stage === stage.stage);
  const next = MASCOT_STAGES[idx + 1] ?? null;
  if (!next) return { stage, next: null, pct: 100 };
  const pct = Math.min(
    100,
    Math.max(
      0,
      ((totalXP - stage.minXP) / (next.minXP - stage.minXP)) * 100,
    ),
  );
  return { stage, next, pct };
}
