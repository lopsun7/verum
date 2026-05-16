"use client";

import { Bot, Dice5, Play, RefreshCcw, Shield, TrendingDown } from "lucide-react";

import { useSimulation } from "@/components/providers/simulation-provider";
import { GlassCard } from "@/components/ui/card";

const scenarios = [
  { id: "normal", label: "Normal", icon: Bot },
  { id: "morpho-spike", label: "Morpho Spike", icon: TrendingDown },
  { id: "liquidity-crunch", label: "Liquidity Crunch", icon: Shield },
  { id: "safe-market", label: "Safe Market", icon: RefreshCcw }
] as const;

export function SimulationControls() {
  const {
    dashboard,
    scenarioId,
    blockNumber,
    autoMode,
    borrowAmount,
    currentProtocol,
    isExecuting,
    constraints,
    setScenario,
    setBorrowAmount,
    setAutoMode,
    setCurrentProtocol,
    updatePool,
    randomizeMarket,
    resetMarket,
    updateConstraints,
    manualTick,
    optimizeBorrow
  } = useSimulation();

  return (
    <div className="space-y-4">
      <GlassCard className="rounded-[30px]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.26em] text-white/42">Fake Chain Simulator</p>
              <h2 className="mt-2 text-2xl font-semibold">Interactive borrower sandbox</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 md:w-[340px]">
              <div className="rounded-2xl border border-white/8 bg-slate-950/50 px-4 py-3">
                <p className="text-xs text-white/40">Live Block</p>
                <p className="mt-1 font-[family:var(--font-mono)] text-lg font-semibold">#{blockNumber}</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-slate-950/50 px-4 py-3">
                <p className="text-xs text-white/40">Current Venue</p>
                <select
                  value={currentProtocol}
                  onChange={(event) => setCurrentProtocol(event.target.value as typeof currentProtocol)}
                  className="mt-1 w-full bg-transparent text-lg font-semibold outline-none"
                >
                  {dashboard.allocations.map((allocation) => (
                    <option key={allocation.protocol} value={allocation.protocol} className="bg-slate-950">
                      {allocation.protocol}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-4">
            {scenarios.map((scenario) => {
              const Icon = scenario.icon;
              const active = scenarioId === scenario.id;

              return (
                <button
                  key={scenario.id}
                  type="button"
                  onClick={() => setScenario(scenario.id)}
                  className={`rounded-[24px] border px-4 py-4 text-left transition ${
                    active
                      ? "border-[#ff9340]/35 bg-[#ff9340]/12 text-white"
                      : "border-white/8 bg-slate-950/45 text-white/72 hover:bg-white/6 hover:text-white"
                  }`}
                >
                  <Icon className="mb-3 h-5 w-5" />
                  <p className="font-medium">{scenario.label}</p>
                </button>
              );
            })}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
            <div className="rounded-[26px] border border-white/8 bg-slate-950/45 p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium">Borrow Amount</p>
                <p className="font-[family:var(--font-mono)] text-sm text-white/72">{borrowAmount.toLocaleString()} USDC</p>
              </div>
              <input
                type="range"
                min={1000}
                max={25000}
                step={500}
                value={borrowAmount}
                onChange={(event) => setBorrowAmount(Number(event.target.value))}
                className="w-full accent-[#ff9340]"
              />
              <div className="mt-3 flex justify-between text-xs text-white/40">
                <span>1,000</span>
                <span>25,000</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAutoMode(!autoMode)}
                className="rounded-[24px] border border-white/8 bg-slate-950/45 px-4 py-4 text-left transition hover:bg-white/6"
              >
                <p className="text-xs text-white/40">Mode</p>
                <p className="mt-2 text-lg font-semibold">{autoMode ? "Auto" : "Manual"}</p>
              </button>
              <button
                type="button"
                onClick={manualTick}
                className="rounded-[24px] border border-white/8 bg-slate-950/45 px-4 py-4 text-left transition hover:bg-white/6"
              >
                <p className="text-xs text-white/40">Advance</p>
                <p className="mt-2 text-lg font-semibold">Mine Block</p>
              </button>
              <button
                type="button"
                onClick={randomizeMarket}
                className="rounded-[24px] border border-white/8 bg-slate-950/45 px-4 py-4 text-left transition hover:bg-white/6"
              >
                <div className="flex items-center gap-2">
                  <Dice5 className="h-4 w-4" />
                  <p className="text-sm font-medium">Randomize Market</p>
                </div>
              </button>
              <button
                type="button"
                onClick={resetMarket}
                className="rounded-[24px] border border-white/8 bg-slate-950/45 px-4 py-4 text-left transition hover:bg-white/6"
              >
                <div className="flex items-center gap-2">
                  <RefreshCcw className="h-4 w-4" />
                  <p className="text-sm font-medium">Reset Demo</p>
                </div>
              </button>
              <button
                type="button"
                onClick={optimizeBorrow}
                disabled={isExecuting}
                className="col-span-2 rounded-[24px] border border-[#ff9340]/28 bg-[#ff9340]/12 px-4 py-4 text-left transition hover:bg-[#ff9340]/16 disabled:opacity-60"
              >
                <div className="flex items-center gap-3">
                  <Play className="h-5 w-5 text-[#ffb36b]" />
                  <div>
                    <p className="text-xs text-white/40">One-click Simulation</p>
                    <p className="mt-1 text-lg font-semibold">{isExecuting ? "Migrating Borrow..." : "Optimize Borrow"}</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <GlassCard className="rounded-[30px]">
          <p className="text-xs uppercase tracking-[0.26em] text-white/42">Manual Market Values</p>
          <h3 className="mt-2 text-2xl font-semibold">Edit pool inputs directly</h3>
          <div className="mt-5 space-y-3">
            {dashboard.allocations.map((pool) => (
              <div key={pool.protocol} className="rounded-[24px] border border-white/8 bg-slate-950/45 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-medium">{pool.protocol}</p>
                  <p className="text-xs text-white/45">{pool.chain}</p>
                </div>
                <div className="grid gap-3 md:grid-cols-5">
                  <label className="text-xs text-white/45">
                    APR
                    <input
                      type="number"
                      step="0.1"
                      value={pool.currentApr}
                      onChange={(event) => updatePool(pool.protocol, { currentApr: Number(event.target.value) })}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none"
                    />
                  </label>
                  <label className="text-xs text-white/45">
                    Utilization
                    <input
                      type="number"
                      step="1"
                      value={pool.utilization}
                      onChange={(event) => updatePool(pool.protocol, { utilization: Number(event.target.value) })}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none"
                    />
                  </label>
                  <label className="text-xs text-white/45">
                    Liquidity
                    <input
                      type="number"
                      step="1"
                      value={pool.liquidityScore}
                      onChange={(event) => updatePool(pool.protocol, { liquidityScore: Number(event.target.value) })}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none"
                    />
                  </label>
                  <label className="text-xs text-white/45">
                    Risk
                    <input
                      type="number"
                      step="1"
                      value={pool.riskScore}
                      onChange={(event) => updatePool(pool.protocol, { riskScore: Number(event.target.value) })}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none"
                    />
                  </label>
                  <label className="text-xs text-white/45">
                    Liquidity USD
                    <input
                      type="number"
                      step="10000"
                      value={pool.availableLiquidityUsd}
                      onChange={(event) => updatePool(pool.protocol, { availableLiquidityUsd: Number(event.target.value) })}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none"
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="rounded-[30px]">
          <p className="text-xs uppercase tracking-[0.26em] text-white/42">Agent Constraints</p>
          <h3 className="mt-2 text-2xl font-semibold">Steer the recommendation</h3>
          <div className="mt-5 space-y-4">
            <label className="block text-xs text-white/45">
              Decision Mode
              <select
                value={constraints.decisionMode}
                onChange={(event) => updateConstraints({ decisionMode: event.target.value as typeof constraints.decisionMode })}
                className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none"
              >
                <option value="lowest-predicted">Lowest Predicted APR</option>
                <option value="lowest-current">Lowest Current APR</option>
                <option value="stable-liquidity">Prefer Stable Liquidity</option>
              </select>
            </label>

            <label className="block text-xs text-white/45">
              Max Utilization: {constraints.maxUtilization}%
              <input
                type="range"
                min={70}
                max={98}
                step={1}
                value={constraints.maxUtilization}
                onChange={(event) => updateConstraints({ maxUtilization: Number(event.target.value) })}
                className="mt-2 w-full accent-[#ff9340]"
              />
            </label>

            <label className="block text-xs text-white/45">
              Min Liquidity Score: {constraints.minLiquidityScore}
              <input
                type="range"
                min={40}
                max={95}
                step={1}
                value={constraints.minLiquidityScore}
                onChange={(event) => updateConstraints({ minLiquidityScore: Number(event.target.value) })}
                className="mt-2 w-full accent-[#ff9340]"
              />
            </label>

            <label className="block text-xs text-white/45">
              Max Risk Score: {constraints.maxRiskScore}
              <input
                type="range"
                min={10}
                max={45}
                step={1}
                value={constraints.maxRiskScore}
                onChange={(event) => updateConstraints({ maxRiskScore: Number(event.target.value) })}
                className="mt-2 w-full accent-[#ff9340]"
              />
            </label>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
