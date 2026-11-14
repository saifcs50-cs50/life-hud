import { useUiStore } from "../store/uiStore";

export interface ChartTheme {
  grid: string;
  axis: string;
  tooltipBg: string;
  tooltipBorder: string;
  tooltipLabel: string;
  accent: {
    telemetry: string;
    throttle: string;
    amber: string;
    streak: string;
    ink: string;
  };
}

const DARK: ChartTheme = {
  grid: "rgba(255,255,255,0.06)",
  axis: "#545c72",
  tooltipBg: "#10141c",
  tooltipBorder: "rgba(255,255,255,0.08)",
  tooltipLabel: "#c2c8da",
  accent: {
    telemetry: "#22d3ee",
    throttle: "#ff2b4d",
    amber: "#ffb020",
    streak: "#34e8a0",
    ink: "#8b93aa",
  },
};

const LIGHT: ChartTheme = {
  grid: "rgba(15,23,42,0.08)",
  axis: "#5b6478",
  tooltipBg: "#ffffff",
  tooltipBorder: "rgba(15,23,42,0.1)",
  tooltipLabel: "#363c4c",
  accent: {
    telemetry: "#0891b2",
    throttle: "#dc2626",
    amber: "#d97706",
    streak: "#059669",
    ink: "#5b6478",
  },
};

/** Recharts needs literal color strings (SVG props), so it can't lean on CSS variables like the rest of the app. */
export function useChartTheme(): ChartTheme {
  const theme = useUiStore((s) => s.theme);
  return theme === "light" ? LIGHT : DARK;
}
