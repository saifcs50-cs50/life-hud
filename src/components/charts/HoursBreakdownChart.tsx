import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useRecentLogs } from "../../lib/history";
import { useChartTheme } from "../../lib/chartTheme";
import { GlassCard } from "../GlassCard";

export function HoursBreakdownChart() {
  const logs = useRecentLogs(14);
  const theme = useChartTheme();
  const data = (logs ?? []).map((l) => ({
    date: l.date.slice(5),
    studyHours: l.studyHours ?? 0,
    youtubeHours: l.youtubeHours ?? 0,
    instagramHours: l.instagramHours ?? 0,
    webSeriesHours: l.webSeriesHours ?? 0,
  }));

  const hasData = data.some(
    (d) =>
      d.studyHours || d.youtubeHours || d.instagramHours || d.webSeriesHours,
  );

  const series = [
    { key: "studyHours", name: "Study", color: theme.accent.telemetry },
    { key: "youtubeHours", name: "YouTube", color: theme.accent.throttle },
    { key: "instagramHours", name: "Instagram", color: theme.accent.amber },
    { key: "webSeriesHours", name: "Web Series", color: theme.accent.ink },
  ] as const;

  return (
    <GlassCard className="p-6">
      <h2 className="mb-4 text-lg font-semibold text-ink-100">
        Hours Breakdown · 14d
      </h2>
      {hasData ? (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
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
                width={30}
              />
              <Tooltip
                contentStyle={{
                  background: theme.tooltipBg,
                  border: `1px solid ${theme.tooltipBorder}`,
                  borderRadius: 12,
                }}
                labelStyle={{ color: theme.tooltipLabel }}
              />
              <Legend wrapperStyle={{ fontSize: 11, color: theme.axis }} />
              {series.map((s) => (
                <Area
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.name}
                  stackId="1"
                  stroke={s.color}
                  fill={s.color}
                  fillOpacity={0.25}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="font-tele text-xs text-ink-700">
          No hours logged yet.
        </p>
      )}
    </GlassCard>
  );
}
