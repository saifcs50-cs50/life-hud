import { create } from "zustand";
import db, { todayKey } from "../lib/db";
import { emptyDailyLog, type DailyLog } from "../lib/types";

type Status = "idle" | "loading" | "ready" | "error";

interface DailyLogState {
  date: string;
  log: DailyLog | null;
  status: Status;
  error: string | null;
  hydrate: () => Promise<void>;
  update: (patch: Partial<DailyLog>) => Promise<void>;
}

export const useDailyLogStore = create<DailyLogState>((set, get) => ({
  date: todayKey(),
  log: null,
  status: "idle",
  error: null,

  hydrate: async () => {
    const date = todayKey();
    set({ status: "loading", date });
    try {
      let log = await db.dailyLogs.get(date);
      if (!log) {
        log = emptyDailyLog(date);
        await db.dailyLogs.put(log);
      }
      set({ log, status: "ready", error: null });
    } catch (err) {
      set({ status: "error", error: (err as Error).message });
    }
  },

  update: async (patch) => {
    const current = get().log;
    if (!current) return;
    const next: DailyLog = { ...current, ...patch, updatedAt: Date.now() };
    set({ log: next });
    await db.dailyLogs.put(next);
  },
}));
