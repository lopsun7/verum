"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import type { ChainAllocation } from "@aegis/shared";

import { formatCompactCurrency } from "@/lib/utils";

const COLORS = ["#ff9340", "#f97316", "#fb7185", "#2dd4bf", "#38bdf8", "#a78bfa"];

export function ChainAllocationChart({ data }: { data: ChainAllocation[] }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="valueUsd"
            nameKey="chain"
            innerRadius={80}
            outerRadius={112}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={1}
            paddingAngle={4}
          >
            {data.map((entry, index) => (
              <Cell key={entry.chain} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => formatCompactCurrency(value)}
            contentStyle={{
              background: "rgba(15,23,42,0.92)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "18px"
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

