import { NavLink } from "react-router-dom";
import { clsx } from "clsx";
import {
  LayoutDashboard,
  ListChecks,
  Swords,
  Trophy,
  Flag,
  BarChart3,
  Gauge,
  Leaf,
  Sun,
  Moon,
} from "lucide-react";
import { useUiStore } from "../store/uiStore";
import { AudioControl } from "./AudioControl";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/trackers", label: "Trackers", icon: ListChecks },
  { to: "/boss-fights", label: "Boss Fights", icon: Swords },
  { to: "/trophy-room", label: "Trophy Room", icon: Trophy },
  { to: "/qualifying", label: "Qualifying", icon: Flag },
  { to: "/reports", label: "Reports", icon: BarChart3 },
];

export function Sidebar() {
  const ecoMode = useUiStore((s) => s.ecoMode);
  const toggleEcoMode = useUiStore((s) => s.toggleEcoMode);
  const theme = useUiStore((s) => s.theme);
  const toggleTheme = useUiStore((s) => s.toggleTheme);

  return (
    <aside className="glass-panel flex h-full w-60 shrink-0 flex-col rounded-2xl p-4">
      <div className="mb-8 flex items-center gap-2 px-2 pt-2">
        <Gauge className="h-6 w-6 text-telemetry-400" strokeWidth={2.25} />
        <span className="font-tele text-sm font-semibold tracking-[0.2em] text-ink-100">
          LIFE H.U.D
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.97]",
                isActive
                  ? "bg-telemetry-500/10 text-telemetry-300 glow-telemetry"
                  : "text-ink-500 hover:bg-white/5 hover:text-ink-100",
              )
            }
          >
            <Icon className="h-4.5 w-4.5" strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={toggleTheme}
        className="mb-2 flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5 text-xs font-medium text-ink-500 transition-colors hover:bg-white/[0.05]"
      >
        <span className="flex items-center gap-2">
          {theme === "dark" ? (
            <Moon className="h-3.5 w-3.5" />
          ) : (
            <Sun className="h-3.5 w-3.5 text-amber-400" />
          )}
          Theme
        </span>
        <span className="font-tele text-[10px] tracking-wide">
          {theme === "dark" ? "DARK" : "LIGHT"}
        </span>
      </button>

      <div className="mb-2">
        <AudioControl />
      </div>

      <button
        type="button"
        onClick={toggleEcoMode}
        className={clsx(
          "mb-2 flex items-center justify-between rounded-xl border px-3 py-2.5 text-xs font-medium transition-colors",
          ecoMode
            ? "border-streak-500/40 bg-streak-500/10 text-streak-300 glow-streak"
            : "border-white/5 bg-white/[0.02] text-ink-500 hover:bg-white/[0.05]",
        )}
      >
        <span className="flex items-center gap-2">
          <Leaf className="h-3.5 w-3.5" />
          Eco Mode
        </span>
        <span className="font-tele text-[10px] tracking-wide">
          {ecoMode ? "ON" : "OFF"}
        </span>
      </button>

      <div className="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5 font-tele text-[11px] tracking-wide text-ink-700">
        ALL SYSTEMS ONLINE
      </div>
    </aside>
  );
}
