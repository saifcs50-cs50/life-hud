import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { TelemetryBar } from "./TelemetryBar";
import { Scene3DRoot } from "../three/Scene3DRoot";
import { AtmosphereBackground } from "./AtmosphereBackground";
import { useDailyLogStore } from "../store/dailyLogStore";
import { useTrophyAutoUnlock } from "../lib/useTrophyAutoUnlock";
import { useUiStore } from "../store/uiStore";
import { todayKey } from "../lib/db";

const DAY_ROLLOVER_CHECK_MS = 30_000;

export function Layout() {
  const hydrate = useDailyLogStore((s) => s.hydrate);
  const theme = useUiStore((s) => s.theme);
  const rootRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // If the tab is left open past local midnight, roll over to the new day's
  // log without needing a manual reload — dailyLogStore keys everything off
  // todayKey(), so re-hydrating just loads/creates the fresh day's row.
  useEffect(() => {
    const id = setInterval(() => {
      if (todayKey() !== useDailyLogStore.getState().date) {
        hydrate();
      }
    }, DAY_ROLLOVER_CHECK_MS);
    return () => clearInterval(id);
  }, [hydrate]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useTrophyAutoUnlock();

  return (
    <div ref={rootRef} className="relative min-h-screen bg-carbon-950">
      <AtmosphereBackground />
      <Scene3DRoot eventSource={rootRef} />
      <div className="relative z-10 flex min-h-screen gap-4 p-4">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <TelemetryBar />
          <main className="flex-1 overflow-y-auto pb-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
