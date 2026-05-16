"use client";

import { useSimulation } from "@/components/providers/simulation-provider";

import { ChainAllocationChart } from "@/components/charts/chain-allocation-chart";
import { ForecastChart } from "@/components/charts/forecast-chart";
import { LiveActivityFeed } from "@/components/dashboard/live-activity-feed";
import { SimulationControls } from "@/components/dashboard/simulation-controls";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/ui/card";
import { formatCompactCurrency, formatCurrency, formatPercent } from "@/lib/utils";

export default function DashboardPage() {
  const { dashboard } = useSimulation();
  const { metric, chains, allocations, forecasts, moves, riskVectors, agentLogs } = dashboard;

  return (
    <AppShell
      currentPath="/dashboard"
      title="Borrow Rate Command Dashboard"
      subtitle="Fake blockchain, fake market data, and live agents continuously simulate where a borrower should move debt for the best risk-adjusted APR."
    >
      <SimulationControls />

      <section className="mt-4 grid gap-4 xl:grid-cols-4">
        {[
          ["Active Borrow", formatCurrency(metric.activeBorrowUsd)],
          ["Current Borrow APR", formatPercent(metric.currentWeightedBorrowApr)],
          ["Best Predicted APR", formatPercent(metric.bestPredictedBorrowApr)],
          ["Projected Savings / Month", formatCurrency(metric.projectedMonthlySavingsUsd)]
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
              <p className="text-xs uppercase tracking-[0.26em] text-white/42">Predictive Borrow Curve</p>
              <h2 className="mt-2 text-2xl font-semibold">Live APR Forecasts</h2>
            </div>
            <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
              simulation
            </div>
          </div>
          <ForecastChart data={forecasts} />
        </GlassCard>

        <GlassCard className="rounded-[30px]">
          <p className="text-xs uppercase tracking-[0.26em] text-white/42">Coverage by Chain</p>
          <h2 className="mt-2 text-2xl font-semibold">Tracked Liquidity</h2>
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
                  <p className="text-xs text-emerald-300">
                    {chain.change24h > 0 ? "+" : ""}
                    {chain.change24h}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr_0.9fr]">
        <GlassCard className="rounded-[30px]">
          <p className="text-xs uppercase tracking-[0.26em] text-white/42">Borrow Venue Matrix</p>
          <h2 className="mt-2 text-2xl font-semibold">Current vs predicted pool costs</h2>
          <div className="mt-6 space-y-3">
            {allocations.map((allocation) => (
              <div key={`${allocation.protocol}-${allocation.chain}`} className="rounded-[22px] border border-white/8 bg-slate-950/48 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{allocation.protocol} · {allocation.chain}</p>
                    <p className="text-xs text-white/45">
                      {allocation.asset} borrow market {allocation.isCurrentPosition ? "· current position" : ""}
                    </p>
                  </div>
                  <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/68">
                    Util {allocation.utilization}%
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-4 gap-3 text-sm">
                  <div>
                    <p className="text-white/38">Current</p>
                    <p className="mt-1 font-medium">{formatPercent(allocation.currentApr)}</p>
                  </div>
                  <div>
                    <p className="text-white/38">Predicted</p>
                    <p className="mt-1 font-medium text-[#ffbe7e]">{formatPercent(allocation.predictedApr)}</p>
                  </div>
                  <div>
                    <p className="text-white/38">Liquidity</p>
                    <p className="mt-1 font-medium">{allocation.liquidityScore}/100</p>
                  </div>
                  <div>
                    <p className="text-white/38">Risk</p>
                    <p className="mt-1 font-medium">{allocation.riskScore}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="rounded-[30px]">
          <p className="text-xs uppercase tracking-[0.26em] text-white/42">Decision Output</p>
          <h2 className="mt-2 text-2xl font-semibold">Simulated migration</h2>
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
                  <span className="text-emerald-300">{formatCurrency(move.expectedMonthlySavingsUsd)}/mo</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="rounded-[30px]">
          <p className="text-xs uppercase tracking-[0.26em] text-white/42">Agent Stream</p>
          <h2 className="mt-2 text-2xl font-semibold">Live reasoning</h2>
          <div className="mt-6">
            <LiveActivityFeed initialLogs={agentLogs} />
          </div>
          <div className="mt-5 rounded-[24px] border border-[#ff9340]/18 bg-[#ff9340]/10 p-4">
            <p className="text-sm leading-6 text-white/72">
              Borrow stability composite: {Math.round(riskVectors.reduce((sum, vector) => sum + vector.liquidityHealth, 0) / riskVectors.length)} / 100.
            </p>
          </div>
        </GlassCard>
      </section>
    </AppShell>
  );
}
