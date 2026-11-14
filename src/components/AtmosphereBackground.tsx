import { motion } from "framer-motion";
import { useTelemetryEngine } from "../lib/useTelemetryEngine";
import { computeGripPct, computeWeather, type WeatherState } from "../lib/gamification";

const LAYERS: { key: WeatherState; className: string }[] = [
  { key: "neutral", className: "ambient-bg" },
  { key: "clear", className: "weather-clear" },
  { key: "stormy", className: "weather-stormy" },
  { key: "thermal", className: "weather-thermal" },
];

function useWeather(): WeatherState {
  const telemetry = useTelemetryEngine();
  if (!telemetry) return "neutral";
  const gripPct = telemetry.todayLog ? computeGripPct(telemetry.todayLog) : 100;
  return computeWeather({
    streak: telemetry.streak,
    slipstream: telemetry.slipstream,
    blackFlag: telemetry.blackFlag,
    gripPct,
  });
}

export function AtmosphereBackground() {
  const weather = useWeather();

  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      {LAYERS.map(({ key, className }) => (
        <motion.div
          key={key}
          className={`absolute inset-0 ${className}`}
          initial={false}
          animate={{ opacity: weather === key ? 1 : 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
