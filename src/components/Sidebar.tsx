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
    <aside className="glass-panel flex shrink-0 flex-wrap items-center gap-x-2 gap-y-3 rounded-lg p-3 md:sticky md:top-4 md:h-[calc(100dvh-2rem)] md:w-60 md:flex-col md:flex-nowrap md:items-stretch md:gap-0 md:overflow-y-auto md:p-4">
      <div className="mr-auto flex items-center gap-2 px-1 md:mr-0 md:mb-8 md:px-2 md:pt-2">
        <Gauge className="h-6 w-6 text-telemetry-400" strokeWidth={2.25} />
        <span className="font-tele text-sm font-semibold tracking-[0.2em] text-ink-100">
          LIFE H.U.D
        </span>
      </div>

      <nav className="order-last flex w-full gap-1 overflow-x-auto [scrollbar-width:none] md:order-none md:flex-1 md:flex-col md:overflow-visible">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              clsx(
                "flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium whitespace-nowrap transition-all active:scale-[0.97] md:gap-3 md:py-2.5",
                isActive
                  ? "bg-telemetry-500/10 text-telemetry-300"
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
        className="flex items-center justify-between gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-2.5 py-1.5 text-xs font-medium text-ink-500 transition-colors hover:bg-white/[0.05] md:mb-2 md:px-3 md:py-2.5"
      >
        <span className="flex items-center gap-2">
          {theme === "dark" ? (
            <Moon className="h-3.5 w-3.5" />
          ) : (
            <Sun className="h-3.5 w-3.5 text-amber-400" />
          )}
          <span className="sr-only md:not-sr-only">Theme</span>
        </span>
        <span className="font-tele text-[10px] tracking-wide">
          {theme === "dark" ? "DARK" : "LIGHT"}
        </span>
      </button>

      <div className="hidden md:mb-2 md:block">
        <AudioControl />
      </div>

      <button
        type="button"
        onClick={toggleEcoMode}
        className={clsx(
          "flex items-center justify-between gap-2 rounded-xl border px-2.5 py-1.5 text-xs font-medium transition-colors md:px-3 md:py-2.5",
          ecoMode
            ? "border-streak-500/40 bg-streak-500/10 text-streak-300"
            : "border-white/5 bg-white/[0.02] text-ink-500 hover:bg-white/[0.05]",
        )}
      >
        <span className="flex items-center gap-2">
          <Leaf className="h-3.5 w-3.5" />
          <span className="sr-only md:not-sr-only">Eco Mode</span>
        </span>
        <span className="font-tele text-[10px] tracking-wide">
          {ecoMode ? "ON" : "OFF"}
        </span>
      </button>
    </aside>
  );
}
