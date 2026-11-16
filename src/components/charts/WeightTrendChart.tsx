import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useRecentLogs } from "../../lib/history";
import { useChartTheme } from "../../lib/chartTheme";
import { GlassCard } from "../GlassCard";

export function WeightTrendChart() {
  const logs = useRecentLogs(30);
  const theme = useChartTheme();
  const data = (logs ?? [])
    .filter((l) => l.weight !== undefined)
    .map((l) => ({ date: l.date.slice(5), weight: l.weight }));

  return (
    <GlassCard className="p-6">
      <h2 className="mb-4 text-lg font-semibold text-ink-100">
        Weight Trend · 30d
      </h2>
      {data.length > 0 ? (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid stroke={theme.grid} vertical={false} />
              <XAxis
                dataKey="date"
                stroke={theme.axis}
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke={theme.axis}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                domain={["auto", "auto"]}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  background: theme.tooltipBg,
                  border: `1px solid ${theme.tooltipBorder}`,
                  borderRadius: 12,
                }}
                labelStyle={{ color: theme.tooltipLabel }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke={theme.accent.telemetry}
                strokeWidth={2}
                dot={{ r: 3, fill: theme.accent.telemetry }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-sm text-ink-500">No weight entries yet.</p>
      )}
    </GlassCard>
  );
}
