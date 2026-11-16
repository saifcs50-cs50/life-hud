import db from "./db";
import type {
  AppSettings,
  BossFight,
  BrainDumpNote,
  CustomTrackerEntry,
  DailyLog,
  QualifyingTarget,
  Trophy,
} from "./types";

export interface ExportBundle {
  exportedAt: string;
  version: number;
  dailyLogs: DailyLog[];
  customTrackers: CustomTrackerEntry[];
  bossFights: BossFight[];
  trophies: Trophy[];
  qualifyingTargets: QualifyingTarget[];
  settings: AppSettings[];
  brainDumpNotes: BrainDumpNote[];
}

export async function exportAllData(): Promise<ExportBundle> {
  const [
    dailyLogs,
    customTrackers,
    bossFights,
    trophies,
    qualifyingTargets,
    settings,
    brainDumpNotes,
  ] = await Promise.all([
    db.dailyLogs.toArray(),
    db.customTrackers.toArray(),
    db.bossFights.toArray(),
    db.trophies.toArray(),
    db.qualifyingTargets.toArray(),
    db.settings.toArray(),
    db.brainDumpNotes.toArray(),
  ]);

  return {
    exportedAt: new Date().toISOString(),
    version: 2,
    dailyLogs,
    customTrackers,
    bossFights,
    trophies,
    qualifyingTargets,
    settings,
    brainDumpNotes,
  };
}

export function downloadJSON(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const BUNDLE_KEYS: (keyof ExportBundle)[] = [
  "dailyLogs",
  "customTrackers",
  "bossFights",
  "trophies",
  "qualifyingTargets",
  "settings",
  "brainDumpNotes",
];

export function isValidExportBundle(data: unknown): data is ExportBundle {
  if (!data || typeof data !== "object") return false;
  const record = data as Record<string, unknown>;
  return BUNDLE_KEYS.every((key) => Array.isArray(record[key]));
}

/** Wipes every table. Used for a full factory reset before real use begins. */
export async function resetAllData() {
  await db.transaction(
    "rw",
    [
      db.dailyLogs,
      db.customTrackers,
      db.bossFights,
      db.trophies,
      db.qualifyingTargets,
      db.settings,
      db.brainDumpNotes,
    ],
    async () => {
      await Promise.all([
        db.dailyLogs.clear(),
        db.customTrackers.clear(),
        db.bossFights.clear(),
        db.trophies.clear(),
        db.qualifyingTargets.clear(),
        db.settings.clear(),
        db.brainDumpNotes.clear(),
      ]);
    },
  );
}

export async function importAllData(bundle: ExportBundle) {
  await db.transaction(
    "rw",
    [
      db.dailyLogs,
      db.customTrackers,
      db.bossFights,
      db.trophies,
      db.qualifyingTargets,
      db.settings,
      db.brainDumpNotes,
    ],
    async () => {
      await Promise.all([
        db.dailyLogs.clear(),
        db.customTrackers.clear(),
        db.bossFights.clear(),
        db.trophies.clear(),
        db.qualifyingTargets.clear(),
        db.settings.clear(),
        db.brainDumpNotes.clear(),
      ]);
      await Promise.all([
        db.dailyLogs.bulkAdd(bundle.dailyLogs),
        db.customTrackers.bulkAdd(bundle.customTrackers),
        db.bossFights.bulkAdd(bundle.bossFights),
        db.trophies.bulkAdd(bundle.trophies),
        db.qualifyingTargets.bulkAdd(bundle.qualifyingTargets),
        db.settings.bulkAdd(bundle.settings),
        db.brainDumpNotes.bulkAdd(bundle.brainDumpNotes),
      ]);
    },
  );
}
