/** ISO date string, YYYY-MM-DD, local calendar day. */
export type DateKey = string;

export interface SkincareChecklist {
  cleanse: boolean;
  treat: boolean;
  hydrate: boolean;
  /** AM only. */
  protect?: boolean;
  /** AM only. */
  omega3?: boolean;
}

export interface DailyLog {
  /** Primary key — one row per calendar day. */
  date: DateKey;

  weight?: number;

  betterThanYesterday?: boolean;
  betterHow?: string;

  workoutDone?: boolean;

  studyHours?: number;
  youtubeHours?: number;
  instagramHours?: number;
  webSeriesHours?: number;

  skincareMorning: SkincareChecklist;
  skincareEvening: SkincareChecklist;
  skinRating?: 1 | 2 | 3 | 4 | 5;

  readingDone?: boolean;
  journaled?: boolean;

  hydrationGlasses?: number;
  ateClean?: boolean;

  afterHoursMinutes?: number;

  /** Today's designated 2x-XP power hour, active for the whole day. */
  drsActive?: boolean;

  /** Pit Stop presses today — each recovers tire grip without touching logged hours. */
  pitStops?: number;

  notes?: string;

  createdAt: number;
  updatedAt: number;
}

export type ActivityTag = "productive" | "unproductive";

export interface CustomTrackerEntry {
  id?: number;
  date: DateKey;
  label: string;
  hours: number;
  tag: ActivityTag;
  notes?: string;
  createdAt: number;
}

export interface BossFight {
  id?: number;
  subject: string;
  examDate: DateKey;
  totalHoursRequired: number;
  hoursLogged: number;
  createdAt: number;
}

export interface Trophy {
  id?: number;
  title: string;
  description: string;
  icon: string;
  unlockedAt: number | null;
}

export interface QualifyingTarget {
  id?: number;
  /** Monday of the target week. */
  weekStart: DateKey;
  label: string;
  targetHours: number;
  achieved: boolean;
}

export interface AppSettings {
  id: 1;
  ecoMode: boolean;
  ambientAudioEnabled: boolean;
  drsWindowStart?: string;
  drsWindowEnd?: string;
}

export type StickyColor = "telemetry" | "throttle" | "amber" | "streak";

export interface BrainDumpNote {
  id?: number;
  text: string;
  color: StickyColor;
  createdAt: number;
}

export function emptySkincare(): SkincareChecklist {
  return {
    cleanse: false,
    treat: false,
    hydrate: false,
    protect: false,
    omega3: false,
  };
}

export function emptyDailyLog(date: DateKey): DailyLog {
  const now = Date.now();
  return {
    date,
    skincareMorning: emptySkincare(),
    skincareEvening: emptySkincare(),
    createdAt: now,
    updatedAt: now,
  };
}
