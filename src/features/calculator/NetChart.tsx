import React from "react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend, ReferenceLine
} from "recharts";
import { SOCIAL_2025 } from "../../lib/social2025";

export function NetChart({ data }: { gross: number; net: number }[]) {
  return (
    <div
      id="net-chart"  // <-- add this so exportReport can capture the chart only
      className="h-80 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/40 p-3 pb-6"
      aria-label="Net income vs gross income chart"
    >
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 40, right: 24, left: 8, bottom: 44 }}>
          <Legend
            layout="horizontal"
            verticalAlign="top"
            align="center"
            iconType="plainline"
            wrapperStyle={{ top: -10, position: "relative" }}
          />
          <XAxis
            dataKey="gross"
            tickFormatter={(v) => "€" + v / 1000 + "k"}
            label={{ value: "Gross (€ / year)", position: "insideBottom", dy: 22 }}
          />
          <YAxis
            tickFormatter={(v) => "€" + v / 1000 + "k"}
            label={{ value: "Net (€ / year)", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            labelFormatter={(l: any) =>
              "Gross " +
              Intl.NumberFormat("de-DE", {
                style: "currency",
                currency: "EUR",
                maximumFractionDigits: 0,
              }).format(l)
            }
          />
          <ReferenceLine x={SOCIAL_2025.bbgKVYear} strokeDasharray="4 4" label={{ value: "KV/PV BBG", position: "top" }} />
          <ReferenceLine x={SOCIAL_2025.bbgRVYear} strokeDasharray="4 4" label={{ value: "RV/AV BBG", position: "top" }} />
          <Area type="monotone" dataKey="net" name="Net income" stroke="#2563eb" fill="#93c5fd" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>

      <p className="mt-2 text-xs text-slate-500">Computed with simplified 2025 rules.</p>
    </div>
  );
}
