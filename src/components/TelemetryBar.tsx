import { clsx } from "clsx";
import { useDailyLogStore } from "../store/dailyLogStore";
import { CheckeredFlagButton } from "./CheckeredFlagButton";
import { LiveClock } from "./LiveClock";

export function TelemetryBar() {
  const status = useDailyLogStore((s) => s.status);
  const date = useDailyLogStore((s) => s.date);

  const formatted = new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="glass-panel flex items-center justify-between rounded-2xl px-6 py-4">
      <div>
        <p className="font-tele text-[11px] tracking-[0.25em] text-ink-700">
          TODAY
        </p>
        <p className="text-lg font-semibold text-ink-100">{formatted}</p>
      </div>

      <LiveClock />

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 font-tele text-xs tracking-wide">
          <span
            className={clsx(
              "h-2 w-2 rounded-full",
              status === "ready" && "bg-streak-500 glow-streak",
              status === "loading" && "animate-pulse bg-amber-500",
              status === "error" && "bg-throttle-500 glow-throttle",
              status === "idle" && "bg-ink-700",
            )}
          />
          <span className="text-ink-500">
            {status === "ready" && "TELEMETRY SYNCED"}
            {status === "loading" && "SYNCING…"}
            {status === "error" && "SYNC ERROR"}
            {status === "idle" && "STANDBY"}
          </span>
        </div>
        <CheckeredFlagButton />
      </div>
    </header>
  );
}
