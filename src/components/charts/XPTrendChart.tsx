import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { useXPTrend } from "../../lib/history";
import { useChartTheme } from "../../lib/chartTheme";
import { GlassCard } from "../GlassCard";

export function XPTrendChart() {
  const points = useXPTrend(7);
  const theme = useChartTheme();
  const data = points ?? [];
  const hasData = data.some((d) => d.xp > 0);

  return (
    <GlassCard className="p-6">
      <h2 className="mb-4 text-lg font-semibold text-ink-100">
        XP Trend · 7d
      </h2>
      {hasData ? (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
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
                formatter={(value) => `${value} XP`}
              />
              <Bar dataKey="xp" radius={[4, 4, 0, 0]}>
                {data.map((d, i) => (
                  <Cell
                    key={d.date}
                    fill={theme.accent.telemetry}
                    fillOpacity={i === data.length - 1 ? 1 : 0.55}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-sm text-ink-500">No XP earned yet this week.</p>
      )}
    </GlassCard>
  );
}
