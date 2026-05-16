"use client";

import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts";

import type { RiskVector } from "@aegis/shared";

export function RiskRadarChart({ vector }: { vector: RiskVector }) {
  const data = [
    { metric: "Smart Contract", value: vector.smartContractRisk },
    { metric: "Audit", value: vector.auditCoverage },
    { metric: "Liquidity", value: vector.liquidityHealth },
    { metric: "Governance", value: vector.governanceDecentralization },
    { metric: "Oracle", value: vector.oracleDependency },
    { metric: "Bad Debt", value: vector.badDebtRisk }
  ];

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.12)" />
          <PolarAngleAxis dataKey="metric" tick={{ fill: "#cbd5e1", fontSize: 11 }} />
          <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
          <Radar dataKey="value" stroke="#ff9340" fill="#ff9340" fillOpacity={0.35} strokeWidth={2} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

