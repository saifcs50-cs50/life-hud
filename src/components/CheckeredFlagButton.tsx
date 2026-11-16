import { useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Flag, X } from "lucide-react";
import { useTelemetryEngine } from "../lib/useTelemetryEngine";

const RADIO_LINES = [
  "Box, box, box. Great work out there today.",
  "That's a strong lap. Bank it and reset for tomorrow.",
  "P1 in your own race today. Get some rest.",
  "Good balance through the whole session. Carry that forward.",
  "Solid stint. Cool the tires, we go again tomorrow.",
  "That's exactly the pace we needed today. Nice drive.",
];

function pickRadioLine(): string {
  return RADIO_LINES[Math.floor(Math.random() * RADIO_LINES.length)];
}

export function CheckeredFlagButton() {
  const [open, setOpen] = useState(false);
  const [line, setLine] = useState(RADIO_LINES[0]);
  const telemetry = useTelemetryEngine();

  const openModal = () => {
    setLine(pickRadioLine());
    setOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs font-medium whitespace-nowrap text-ink-300 transition-colors hover:bg-white/[0.06]"
      >
        <Flag className="h-3.5 w-3.5" />
        End Day
      </button>

      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 12 }}
                transition={{ duration: 0.25 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-carbon-900"
              >
                <div className="checkered-flag h-16 w-full opacity-90" />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="absolute top-3 right-3 rounded-full bg-black/40 p-1.5 text-ink-300 hover:bg-black/60"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="flex flex-col gap-4 p-6">
                  <div>
                    <p className="font-tele text-[11px] tracking-[0.2em] text-ink-700">
                      TEAM RADIO
                    </p>
                    <p className="mt-1 text-lg font-semibold text-ink-100">
                      {line}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 border-t border-white/5 pt-4">
                    <div>
                      <p className="text-xs text-ink-500">XP Today</p>
                      <p className="font-tele text-lg text-telemetry-300">
                        {telemetry?.todayXP ?? 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-ink-500">Combo</p>
                      <p className="font-tele text-lg text-streak-400">
                        {telemetry?.streak ?? 0}d
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-ink-500">Hours</p>
                      <p className="font-tele text-lg text-ink-100">
                        {(telemetry?.todayHours ?? 0).toFixed(1)}h
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-ink-500">
                    See you at tomorrow&rsquo;s grid walk. Rest well.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
