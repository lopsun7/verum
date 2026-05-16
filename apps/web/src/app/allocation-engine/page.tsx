import { dashboardMock } from "@/lib/demo-data";

import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/ui/card";
import { formatCompactCurrency, formatConfidence, formatPercent } from "@/lib/utils";

export default function AllocationEnginePage() {
  return (
    <AppShell
      currentPath="/allocation-engine"
      title="AI Allocation Engine"
      subtitle="Inspect how yield forecasts, risk gating, utilization signals, and execution cost models drive every autonomous treasury move."
    >
      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <GlassCard className="rounded-[30px]">
          <p className="text-xs uppercase tracking-[0.26em] text-white/42">Current Positions</p>
          <h2 className="mt-2 text-2xl font-semibold">Capital deployment map</h2>
          <div className="mt-6 space-y-4">
            {dashboardMock.allocations.map((allocation) => (
              <div key={`${allocation.protocol}-${allocation.chain}`} className="rounded-[24px] border border-white/8 bg-slate-950/48 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-medium">{allocation.protocol}</p>
                    <p className="text-xs text-white/45">{allocation.chain} · {allocation.asset}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">{formatCompactCurrency(allocation.valueUsd)}</p>
                    <p className="text-xs text-white/45">Risk {allocation.riskScore}</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-white/38">Current</p>
                    <p className="mt-1 font-medium">{formatPercent(allocation.currentApy)}</p>
                  </div>
                  <div>
                    <p className="text-white/38">Predicted</p>
                    <p className="mt-1 font-medium text-[#ffbe7e]">{formatPercent(allocation.predictedApy)}</p>
                  </div>
                  <div>
                    <p className="text-white/38">Health</p>
                    <p className="mt-1 font-medium">{allocation.health}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="space-y-4">
          <GlassCard className="rounded-[30px]">
            <p className="text-xs uppercase tracking-[0.26em] text-white/42">Recommended Reallocation</p>
            <h2 className="mt-2 text-2xl font-semibold">Autonomous move queue</h2>
            <div className="mt-6 space-y-4">
              {dashboardMock.moves.map((move) => (
                <div key={move.id} className="rounded-[24px] border border-[#ff9340]/16 bg-[#ff9340]/7 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-lg font-medium">
                        {move.fromProtocol} / {move.fromChain} → {move.toProtocol} / {move.toChain}
                      </p>
                      <p className="mt-1 text-sm text-white/54">{move.timestamp} · {move.asset}</p>
                    </div>
                    <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70">
                      {move.status}
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-white/68">{move.reason}</p>
                  <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                    <div className="rounded-2xl border border-white/8 bg-slate-950/40 p-3">
                      <p className="text-white/38">Amount</p>
                      <p className="mt-1 font-medium">{formatCompactCurrency(move.amountUsd)}</p>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-slate-950/40 p-3">
                      <p className="text-white/38">Expected Gain</p>
                      <p className="mt-1 font-medium text-emerald-300">+{move.expectedGainBps} bps</p>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-slate-950/40 p-3">
                      <p className="text-white/38">Confidence</p>
                      <p className="mt-1 font-medium">{formatConfidence(move.confidence)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="rounded-[30px]">
            <p className="text-xs uppercase tracking-[0.26em] text-white/42">Explainability Layer</p>
            <h2 className="mt-2 text-2xl font-semibold">Why capital moved</h2>
            <div className="mt-5 space-y-3 text-sm leading-7 text-white/68">
              <p>
                Qwen risk reasoning weighted Morpho Base higher because projected utilization increases outpaced gas-adjusted entry costs while exploit probability remained below the emergency threshold.
              </p>
              <p>
                The stablecoin rotation policy maintained USDC dominance because cross-venue liquidity depth exceeded DAI and USDT, and sUSDe carry was discounted for sentiment volatility.
              </p>
              <p>
                MEV-aware routing switched to a safer bridge path when expected slippage on the primary route exceeded the policy envelope by 21 basis points.
              </p>
            </div>
          </GlassCard>
        </div>
      </section>
    </AppShell>
  );
}
