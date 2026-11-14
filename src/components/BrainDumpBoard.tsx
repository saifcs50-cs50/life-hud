import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Plus, X, StickyNote } from "lucide-react";
import { clsx } from "clsx";
import db from "../lib/db";
import type { StickyColor } from "../lib/types";
import { GlassCard } from "./GlassCard";

const COLORS: StickyColor[] = ["telemetry", "throttle", "amber", "streak"];

const COLOR_CLASSES: Record<StickyColor, string> = {
  telemetry: "border-telemetry-400/30 bg-telemetry-500/10 text-telemetry-200",
  throttle: "border-throttle-400/30 bg-throttle-500/10 text-throttle-200",
  amber: "border-amber-400/30 bg-amber-500/10 text-amber-200",
  streak: "border-streak-400/30 bg-streak-500/10 text-streak-200",
};

export function BrainDumpBoard() {
  const notes = useLiveQuery(
    () => db.brainDumpNotes.orderBy("createdAt").reverse().toArray(),
    [],
  );
  const [draft, setDraft] = useState("");

  const addNote = async () => {
    const text = draft.trim();
    if (!text) return;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    await db.brainDumpNotes.add({ text, color, createdAt: Date.now() });
    setDraft("");
  };

  const removeNote = async (id: number) => {
    await db.brainDumpNotes.delete(id);
  };

  return (
    <GlassCard className="p-6">
      <div className="mb-4 flex items-center gap-2">
        <StickyNote className="h-5 w-5 text-ink-500" />
        <h2 className="text-lg font-semibold text-ink-100">Brain Dump</h2>
      </div>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addNote();
          }}
          placeholder="Drop a thought…"
          className="flex-1 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-2.5 text-sm text-ink-100 outline-none focus:border-telemetry-500/50"
        />
        <button
          type="button"
          onClick={addNote}
          className="flex items-center gap-1.5 rounded-xl border border-telemetry-400/30 bg-telemetry-500/10 px-4 py-2.5 text-sm font-medium text-telemetry-300 hover:bg-telemetry-500/20"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>

      {notes && notes.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className={clsx(
                "group relative w-48 rounded-xl border p-3 text-sm",
                COLOR_CLASSES[note.color],
              )}
            >
              <button
                type="button"
                onClick={() => note.id !== undefined && removeNote(note.id)}
                className="absolute top-1.5 right-1.5 rounded-md p-1 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white/10"
                aria-label="Delete note"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <p className="pr-4 leading-snug">{note.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="font-tele text-xs text-ink-700">
          No notes yet — clear the mental cache.
        </p>
      )}
    </GlassCard>
  );
}
