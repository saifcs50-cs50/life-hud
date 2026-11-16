import { useLiveQuery } from "dexie-react-hooks";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { GlassCard } from "../GlassCard";
import { useDailyLogStore } from "../../store/dailyLogStore";
import { useChartTheme } from "../../lib/chartTheme";
import db, { todayKey } from "../../lib/db";

export function TodaySplitChart() {
  const log = useDailyLogStore((s) => s.log);
  const theme = useChartTheme();
  const date = todayKey();
  const trackers = useLiveQuery(
    () => db.customTrackers.where("date").equals(date).toArray(),
    [date],
  );

  if (!log) return null;

  const productiveExtra = (trackers ?? [])
    .filter((t) => t.tag === "productive")
    .reduce((sum, t) => sum + t.hours, 0);
  const unproductiveExtra = (trackers ?? [])
    .filter((t) => t.tag === "unproductive")
    .reduce((sum, t) => sum + t.hours, 0);

  const slices = [
    { name: "Study", value: log.studyHours ?? 0, color: theme.accent.telemetry, opacity: 1 },
    { name: "YouTube", value: log.youtubeHours ?? 0, color: theme.accent.throttle, opacity: 1 },
    { name: "Instagram", value: log.instagramHours ?? 0, color: theme.accent.amber, opacity: 1 },
    { name: "Web Series", value: log.webSeriesHours ?? 0, color: theme.accent.ink, opacity: 1 },
    { name: "Other productive", value: productiveExtra, color: theme.accent.streak, opacity: 1 },
    { name: "Other unproductive", value: unproductiveExtra, color: theme.accent.throttle, opacity: 0.5 },
  ].filter((d) => d.value > 0);

  const total = slices.reduce((sum, d) => sum + d.value, 0);

  return (
    <GlassCard className="p-6">
      <h2 className="mb-4 text-lg font-semibold text-ink-100">
        Today&rsquo;s Split
      </h2>
      {slices.length > 0 ? (
        <div className="flex items-center gap-5">
          <div className="h-44 w-44 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={slices}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="62%"
                  outerRadius="92%"
                  paddingAngle={2}
                  stroke="none"
                >
                  {slices.map((d) => (
                    <Cell key={d.name} fill={d.color} fillOpacity={d.opacity} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: theme.tooltipBg,
                    border: `1px solid ${theme.tooltipBorder}`,
                    borderRadius: 12,
                  }}
                  labelStyle={{ color: theme.tooltipLabel }}
                  formatter={(value) => `${Number(value).toFixed(1)}h`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            {slices.map((d) => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: d.color, opacity: d.opacity }}
                />
                <span className="text-ink-500">{d.name}</span>
                <span className="font-tele ml-auto text-ink-300">
                  {d.value.toFixed(1)}h
                </span>
              </div>
            ))}
            <div className="mt-1 flex items-center gap-2 border-t border-white/5 pt-1.5 text-xs">
              <span className="text-ink-700">Total</span>
              <span className="font-tele ml-auto text-ink-100">
                {total.toFixed(1)}h
              </span>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-ink-500">No hours logged today.</p>
      )}
    </GlassCard>
  );
}
