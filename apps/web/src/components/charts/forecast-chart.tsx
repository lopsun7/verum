"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { BorrowForecastPoint } from "@/lib/demo-data";

export function ForecastChart({ data }: { data: BorrowForecastPoint[] }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="morpho" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff9340" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#ff9340" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="aave" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.55} />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
          <XAxis dataKey="timestamp" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} domain={[4, 13]} />
          <Tooltip
            contentStyle={{
              background: "rgba(15,23,42,0.92)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "18px"
            }}
          />
          <Area type="monotone" dataKey="morpho" stroke="#ff9340" fill="url(#morpho)" strokeWidth={3} />
          <Area type="monotone" dataKey="aave" stroke="#38bdf8" fill="url(#aave)" strokeWidth={2.5} />
          <Area type="monotone" dataKey="spark" stroke="#2dd4bf" fillOpacity={0} strokeWidth={2} />
          <Area type="monotone" dataKey="compound" stroke="#f472b6" fillOpacity={0} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
