import { dashboardMock } from "@aegis/shared";

import { RiskRadarChart } from "@/components/charts/risk-radar-chart";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/ui/card";

export default function RiskTerminalPage() {
  const focus = dashboardMock.riskVectors[1];

  return (
    <AppShell
      currentPath="/risk-terminal"
      title="Protocol Risk Terminal"
      subtitle="Track exploit probability, audit coverage, TVL resilience, governance risk, oracle concentration, and bad debt signals before exposure turns toxic."
    >
      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <GlassCard className="rounded-[30px]">
          <p className="text-xs uppercase tracking-[0.26em] text-white/42">Risk Radar</p>
          <h2 className="mt-2 text-2xl font-semibold">{focus.protocol} composite posture</h2>
          <RiskRadarChart vector={focus} />
          <div className="grid grid-cols-2 gap-3">
            {[
              ["Exploit Probability", `${focus.exploitProbability}%`],
              ["TVL Momentum", `${focus.tvlTrend}/100`],
              ["Governance Decentralization", `${focus.governanceDecentralization}/100`],
              ["Oracle Dependency", `${focus.oracleDependency}/100`]
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/8 bg-slate-950/48 p-4">
                <p className="text-xs text-white/42">{label}</p>
                <p className="mt-2 text-xl font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="rounded-[30px]">
          <p className="text-xs uppercase tracking-[0.26em] text-white/42">Risk Matrix</p>
          <h2 className="mt-2 text-2xl font-semibold">Cross-protocol safety heatmap</h2>
          <div className="mt-6 overflow-hidden rounded-[24px] border border-white/8">
            <div className="grid grid-cols-7 bg-white/6 text-xs uppercase tracking-[0.2em] text-white/45">
              {["Protocol", "Contract", "Audit", "Liquidity", "Governance", "Oracle", "Bad Debt"].map((header) => (
                <div key={header} className="px-4 py-3">
                  {header}
                </div>
              ))}
            </div>
            {dashboardMock.riskVectors.map((vector) => (
              <div key={vector.protocol} className="grid grid-cols-7 border-t border-white/8 text-sm">
                <div className="px-4 py-4 font-medium">{vector.protocol}</div>
                {[
                  vector.smartContractRisk,
                  vector.auditCoverage,
                  vector.liquidityHealth,
                  vector.governanceDecentralization,
                  vector.oracleDependency,
                  vector.badDebtRisk
                ].map((value, index) => (
                  <div
                    key={`${vector.protocol}-${index}`}
                    className="px-4 py-4"
                    style={{
                      background: `linear-gradient(90deg, rgba(255,147,64,${value / 180}) 0%, rgba(255,147,64,0.04) 100%)`
                    }}
                  >
                    {value}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {[
              ["Emergency Exit Threshold", "25% exploit probability"],
              ["Oracle Dependency Guardrail", "Max 75 / 100"],
              ["Governance Alert Trigger", "Below 68 / 100"]
            ].map(([label, value]) => (
              <div key={label} className="rounded-[24px] border border-white/8 bg-slate-950/42 p-4">
                <p className="text-xs text-white/42">{label}</p>
                <p className="mt-3 text-lg font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>
    </AppShell>
  );
}

