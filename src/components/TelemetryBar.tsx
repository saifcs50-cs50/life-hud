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
    <header className="glass-panel flex flex-wrap items-center justify-between gap-x-6 gap-y-2 rounded-lg px-4 py-3 md:px-6 md:py-4">
      <p className="text-lg font-semibold text-ink-100">{formatted}</p>

      <LiveClock />

      <div className="ml-auto flex items-center gap-4 lg:ml-0">
        <div className="flex items-center gap-2 font-tele text-xs tracking-wide whitespace-nowrap">
          <span
            className={clsx(
              "h-2 w-2 rounded-full",
              status === "ready" && "bg-streak-500",
              status === "loading" && "animate-pulse bg-amber-500",
              status === "error" && "bg-throttle-500",
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
