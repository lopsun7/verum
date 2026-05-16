"use client";

import { Bot, Play, RefreshCcw, Shield, TrendingDown } from "lucide-react";

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
    scenarioId,
    blockNumber,
    autoMode,
    borrowAmount,
    currentProtocol,
    isExecuting,
    setScenario,
    setBorrowAmount,
    setAutoMode,
    manualTick,
    optimizeBorrow
  } = useSimulation();

  return (
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
              <p className="mt-1 text-lg font-semibold">{currentProtocol}</p>
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
  );
}
