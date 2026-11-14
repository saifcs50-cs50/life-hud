import { useRef, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import {
  Download,
  Upload,
  Copy,
  Check,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import db from "../lib/db";
import { useTelemetryEngine } from "../lib/useTelemetryEngine";
import {
  downloadJSON,
  exportAllData,
  importAllData,
  isValidExportBundle,
  resetAllData,
  type ExportBundle,
} from "../lib/dataTransfer";

export function Reports() {
  const telemetry = useTelemetryEngine();
  const trophyCount = useLiveQuery(() => db.trophies.count(), []) ?? 0;

  const [pendingBundle, setPendingBundle] = useState<ExportBundle | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importDone, setImportDone] = useState(false);
  const [copyState, setCopyState] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    const bundle = await exportAllData();
    downloadJSON(bundle, `life-hud-backup-${bundle.exportedAt.slice(0, 10)}.json`);
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setImportError(null);
    setImportDone(false);

    try {
      const text = await file.text();
      const data: unknown = JSON.parse(text);
      if (!isValidExportBundle(data)) {
        setImportError("That file doesn't look like a Life H.U.D backup.");
        return;
      }
      setPendingBundle(data);
    } catch {
      setImportError("Couldn't read that file as JSON.");
    }
  };

  const confirmImport = async () => {
    if (!pendingBundle) return;
    await importAllData(pendingBundle);
    setPendingBundle(null);
    setImportDone(true);
  };

  const confirmReset = async () => {
    await resetAllData();
    window.location.reload();
  };

  const blueprintLines: (string | undefined)[] = telemetry
    ? [
        "LIFE H.U.D — MASTER BLUEPRINT",
        `Generated: ${new Date().toLocaleString()}`,
        "",
        `Mascot Stage: ${telemetry.mascot.stage.name} (${telemetry.totalXP} career XP)`,
        `Combo Streak: ${telemetry.streak} day(s) — ×${telemetry.multiplier.toFixed(2)} multiplier`,
        `Today: ${telemetry.todayHours.toFixed(1)}h productive, ${telemetry.todayXP} XP earned`,
        `Past Self Best (7d): ${telemetry.pastBest.toFixed(1)}h`,
        `AI Rival Target: ${telemetry.rival.toFixed(1)}h`,
        telemetry.slipstream ? "Slipstream: ACTIVE (1.5x XP)" : undefined,
        telemetry.blackFlag ? "Black Flag: ACTIVE (rival boosted)" : undefined,
        telemetry.fastestLap
          ? `Fastest Lap this week: ${telemetry.fastestLap.date} (${telemetry.fastestLap.ratio.toFixed(1)}:1)`
          : undefined,
        `Trophies Unlocked: ${trophyCount}`,
      ]
    : [];
  const blueprintText = blueprintLines.filter((l): l is string => l !== undefined).join("\n");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(blueprintText);
      setCopyError(null);
      setCopyState(true);
      setTimeout(() => setCopyState(false), 1800);
    } catch {
      setCopyError("Couldn't access the clipboard — copy the text manually instead.");
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <GlassCard className="flex flex-col gap-4 p-6">
        <div>
          <h2 className="text-lg font-semibold text-ink-100">
            Telemetric Teleport
          </h2>
          <p className="mt-1 text-xs text-ink-500">
            Export a full backup of every log, tracker, and trophy — or
            restore from one.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 rounded-xl border border-telemetry-400/30 bg-telemetry-500/10 px-4 py-2.5 text-sm font-medium text-telemetry-300 hover:bg-telemetry-500/20"
          >
            <Download className="h-4 w-4" />
            Export Backup
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm font-medium text-ink-300 hover:bg-white/[0.06]"
          >
            <Upload className="h-4 w-4" />
            Import Backup
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleFileSelected}
          />
        </div>

        {importError && (
          <div className="flex items-center gap-2 rounded-xl border border-throttle-500/30 bg-throttle-500/10 px-4 py-2.5 text-xs text-throttle-300">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {importError}
          </div>
        )}

        {pendingBundle && (
          <div className="flex flex-col gap-3 rounded-xl border border-amber-400/30 bg-amber-500/10 p-4">
            <p className="text-xs text-amber-200">
              This will <span className="font-semibold">replace</span> all
              current data with this backup ({pendingBundle.dailyLogs.length}{" "}
              daily logs, {pendingBundle.trophies.length} trophies,{" "}
              {pendingBundle.customTrackers.length} tracker entries) from{" "}
              {new Date(pendingBundle.exportedAt).toLocaleString()}.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={confirmImport}
                className="rounded-lg border border-throttle-500/40 bg-throttle-500/10 px-3 py-1.5 text-xs font-medium text-throttle-300 hover:bg-throttle-500/20"
              >
                Confirm Replace
              </button>
              <button
                type="button"
                onClick={() => setPendingBundle(null)}
                className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs font-medium text-ink-500 hover:bg-white/[0.06]"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {importDone && (
          <div className="flex items-center gap-2 rounded-xl border border-streak-500/30 bg-streak-500/10 px-4 py-2.5 text-xs text-streak-300">
            <Check className="h-4 w-4 shrink-0" />
            Backup restored. Reload to see it everywhere.
          </div>
        )}
      </GlassCard>

      <GlassCard className="flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-ink-100">
              Master Blueprint
            </h2>
            <p className="mt-1 text-xs text-ink-500">
              A single-block summary — paste it anywhere.
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            disabled={!telemetry}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-xs font-medium text-ink-300 transition-opacity hover:bg-white/[0.06] disabled:opacity-40"
          >
            {copyState ? (
              <Check className="h-3.5 w-3.5 text-streak-400" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            {copyState ? "Copied" : "Copy"}
          </button>
        </div>

        <pre className="font-tele max-h-80 overflow-auto rounded-xl border border-white/5 bg-white/[0.02] p-4 text-xs whitespace-pre-wrap text-ink-300">
          {blueprintText || "SPOOLING…"}
        </pre>

        {copyError && (
          <div className="flex items-center gap-2 rounded-xl border border-throttle-500/30 bg-throttle-500/10 px-4 py-2.5 text-xs text-throttle-300">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {copyError}
          </div>
        )}
      </GlassCard>

      <GlassCard glow="throttle" className="flex flex-col gap-4 p-6 xl:col-span-2">
        <div>
          <h2 className="text-lg font-semibold text-throttle-300">
            Danger Zone
          </h2>
          <p className="mt-1 text-xs text-ink-500">
            Wipes every daily log, tracker, boss fight, trophy, and
            qualifying target — a full factory reset. Grab an Export Backup
            above first if you want to keep anything.
          </p>
        </div>

        {!confirmingReset ? (
          <button
            type="button"
            onClick={() => setConfirmingReset(true)}
            className="flex w-fit items-center gap-1.5 rounded-xl border border-throttle-500/30 bg-throttle-500/10 px-4 py-2.5 text-sm font-medium text-throttle-300 hover:bg-throttle-500/20"
          >
            <Trash2 className="h-4 w-4" />
            Reset All Data
          </button>
        ) : (
          <div className="flex flex-col gap-3 rounded-xl border border-throttle-500/30 bg-throttle-500/10 p-4">
            <p className="text-xs text-throttle-200">
              This cannot be undone. Every log, tracker, boss fight, trophy,
              and target will be permanently deleted and the app will
              restart at zero.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={confirmReset}
                className="rounded-lg border border-throttle-500/50 bg-throttle-500/20 px-3 py-1.5 text-xs font-semibold text-throttle-200 hover:bg-throttle-500/30"
              >
                Yes, wipe everything
              </button>
              <button
                type="button"
                onClick={() => setConfirmingReset(false)}
                className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs font-medium text-ink-500 hover:bg-white/[0.06]"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
