import Dexie, { type EntityTable } from "dexie";
import type {
  AppSettings,
  BossFight,
  BrainDumpNote,
  CustomTrackerEntry,
  DailyLog,
  QualifyingTarget,
  Trophy,
} from "./types";

const db = new Dexie("life-hud") as Dexie & {
  dailyLogs: EntityTable<DailyLog, "date">;
  customTrackers: EntityTable<CustomTrackerEntry, "id">;
  bossFights: EntityTable<BossFight, "id">;
  trophies: EntityTable<Trophy, "id">;
  qualifyingTargets: EntityTable<QualifyingTarget, "id">;
  settings: EntityTable<AppSettings, "id">;
  brainDumpNotes: EntityTable<BrainDumpNote, "id">;
};

db.version(1).stores({
  dailyLogs: "date, createdAt",
  customTrackers: "++id, date, tag",
  bossFights: "++id, examDate",
  trophies: "++id, unlockedAt",
  qualifyingTargets: "++id, weekStart",
  settings: "id",
});

db.version(2).stores({
  brainDumpNotes: "++id, createdAt",
});

export default db;

/** YYYY-MM-DD for the caller's local calendar day. */
export function todayKey(): string {
  return shiftDateKey(new Date(), 0);
}

/** YYYY-MM-DD `days` away from `from` (negative = past). */
export function shiftDateKey(from: string | Date, days: number): string {
  const d = typeof from === "string" ? new Date(`${from}T00:00:00`) : new Date(from);
  d.setDate(d.getDate() + days);
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offset).toISOString().slice(0, 10);
}
