import { dashboardMock } from "@/lib/demo-data";

import { ChainAllocationChart } from "@/components/charts/chain-allocation-chart";
import { ForecastChart } from "@/components/charts/forecast-chart";
import { LiveActivityFeed } from "@/components/dashboard/live-activity-feed";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/ui/card";
import { formatCompactCurrency, formatCurrency, formatPercent } from "@/lib/utils";

export default function DashboardPage() {
  const { metric, chains, allocations, forecasts, moves, riskVectors, agentLogs } = dashboardMock;

  return (
    <AppShell
      currentPath="/dashboard"
      title="Treasury Command Dashboard"
      subtitle="Monitor portfolio value, predicted future yield, autonomous capital movements, and safety posture across every supported chain from a single institutional command center."
    >
      <section className="grid gap-4 xl:grid-cols-4">
        {[
          ["Portfolio Value", formatCurrency(metric.totalValueUsd)],
          ["Predicted Net APY", formatPercent(metric.predictedNetApy)],
          ["AI Confidence", `${metric.aiConfidence}%`],
          ["Gas Optimization", `${metric.gasEfficiency}%`]
        ].map(([label, value]) => (
          <GlassCard key={label} className="rounded-[28px] p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-white/38">{label}</p>
            <p className="mt-3 text-3xl font-semibold">{value}</p>
          </GlassCard>
        ))}
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <GlassCard className="rounded-[30px]">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.26em] text-white/42">Predictive Yield Curve</p>
              <h2 className="mt-2 text-2xl font-semibold">Future APY Forecasts</h2>
            </div>
            <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
              6h horizon
            </div>
          </div>
          <ForecastChart data={forecasts} />
        </GlassCard>

        <GlassCard className="rounded-[30px]">
          <p className="text-xs uppercase tracking-[0.26em] text-white/42">Chain Allocation</p>
          <h2 className="mt-2 text-2xl font-semibold">Capital by Network</h2>
          <ChainAllocationChart data={chains} />
          <div className="mt-4 grid gap-3">
            {chains.map((chain) => (
              <div key={chain.chain} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/6 px-4 py-3">
                <div>
                  <p className="font-medium">{chain.chain}</p>
                  <p className="text-xs text-white/45">{formatCompactCurrency(chain.valueUsd)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{chain.share}%</p>
                  <p className="text-xs text-emerald-300">{chain.change24h > 0 ? "+" : ""}{chain.change24h}%</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr_0.9fr]">
        <GlassCard className="rounded-[30px]">
          <p className="text-xs uppercase tracking-[0.26em] text-white/42">Protocol Heatmap</p>
          <h2 className="mt-2 text-2xl font-semibold">Gas-adjusted allocation matrix</h2>
          <div className="mt-6 space-y-3">
            {allocations.map((allocation) => (
              <div key={`${allocation.protocol}-${allocation.chain}`} className="rounded-[22px] border border-white/8 bg-slate-950/48 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{allocation.protocol} · {allocation.chain}</p>
                    <p className="text-xs text-white/45">{allocation.asset} reserve</p>
                  </div>
                  <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/68">
                    Risk {allocation.riskScore}
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-white/38">Current APY</p>
                    <p className="mt-1 font-medium">{formatPercent(allocation.currentApy)}</p>
                  </div>
                  <div>
                    <p className="text-white/38">Predicted APY</p>
                    <p className="mt-1 font-medium text-[#ffbe7e]">{formatPercent(allocation.predictedApy)}</p>
                  </div>
                  <div>
                    <p className="text-white/38">Capital</p>
                    <p className="mt-1 font-medium">{formatCompactCurrency(allocation.valueUsd)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="rounded-[30px]">
          <p className="text-xs uppercase tracking-[0.26em] text-white/42">Autonomous Moves</p>
          <h2 className="mt-2 text-2xl font-semibold">Live transaction feed</h2>
          <div className="mt-6 space-y-3">
            {moves.map((move) => (
              <div key={move.id} className="rounded-[24px] border border-white/8 bg-white/6 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{move.fromProtocol} → {move.toProtocol}</p>
                  <p className="text-xs text-white/42">{move.status}</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-white/64">{move.reason}</p>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span>{formatCompactCurrency(move.amountUsd)} · {move.asset}</span>
                  <span className="text-emerald-300">+{move.expectedGainBps} bps</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="rounded-[30px]">
          <p className="text-xs uppercase tracking-[0.26em] text-white/42">AI Operations</p>
          <h2 className="mt-2 text-2xl font-semibold">Live agent reasoning</h2>
          <div className="mt-6">
            <LiveActivityFeed initialLogs={agentLogs} />
          </div>
          <div className="mt-5 rounded-[24px] border border-[#ff9340]/18 bg-[#ff9340]/10 p-4">
            <p className="text-sm leading-6 text-white/72">
              Safety composite: {Math.round(riskVectors.reduce((sum, vector) => sum + vector.smartContractRisk, 0) / riskVectors.length)} / 100
              with emergency exit playbooks armed across all stablecoin pools.
            </p>
          </div>
        </GlassCard>
      </section>
    </AppShell>
  );
}
