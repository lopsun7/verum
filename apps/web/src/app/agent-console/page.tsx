"use client";

import { useSimulation } from "@/components/providers/simulation-provider";

import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/ui/card";

export default function AgentConsolePage() {
  const { dashboard, currentProtocol, borrowAmount, scenarioId } = useSimulation();

  return (
    <AppShell
      currentPath="/agent-console"
      title="Autonomous Agent Console"
      subtitle="Watch the fake chain state tick forward while the four-agent stack re-evaluates the borrower’s best venue in real time."
    >
      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <GlassCard className="terminal-grid rounded-[30px]">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.26em] text-white/42">Live Reasoning Stream</p>
              <h2 className="mt-2 text-2xl font-semibold">Agent memory + task bus</h2>
            </div>
            <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
              4 agents active
            </div>
          </div>
          <div className="space-y-3 font-[family:var(--font-mono)] text-sm">
            {dashboard.agentLogs.map((log) => (
              <div key={log.id} className="rounded-2xl border border-white/8 bg-slate-950/62 px-4 py-3">
                <p className="text-white/38">
                  [{log.timestamp}] [{log.agent}] [{log.level.toUpperCase()}]
                </p>
                <p className="mt-2 text-white/78">{log.message}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="space-y-4">
          <GlassCard className="rounded-[30px]">
            <p className="text-xs uppercase tracking-[0.26em] text-white/42">Agent Topology</p>
            <h2 className="mt-2 text-2xl font-semibold">Specialized microservices</h2>
            <div className="mt-6 space-y-3">
              {[
                ["RateDataAgent", "Collects mock lending pool APRs and utilization snapshots.", "Input"],
                ["PredictionAgent", "Applies utilization and liquidity rules to estimate near-term APR movement.", "Forecast"],
                ["DecisionAgent", "Ranks venues by predicted APR plus borrower risk penalties.", "Decision"],
                ["ExecutionAgent", "Produces a simulated debt migration checklist and fake receipt.", "Execution"]
              ].map(([name, role, domain]) => (
                <div key={name} className="rounded-[24px] border border-white/8 bg-slate-950/48 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{name}</p>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">{domain}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/60">{role}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="rounded-[30px]">
            <p className="text-xs uppercase tracking-[0.26em] text-white/42">Memory State</p>
            <h2 className="mt-2 text-2xl font-semibold">Shared context snapshot</h2>
            <div className="mt-5 space-y-3 font-[family:var(--font-mono)] text-sm text-white/76">
              <div className="rounded-2xl border border-white/8 bg-slate-950/48 p-4">{`active_borrow_position: ${currentProtocol} / ${borrowAmount} USDC`}</div>
              <div className="rounded-2xl border border-white/8 bg-slate-950/48 p-4">{`recommended_venue: ${dashboard.moves[0]?.toProtocol ?? "Compound"} / ${dashboard.moves[0]?.toChain ?? "Ethereum"}`}</div>
              <div className="rounded-2xl border border-white/8 bg-slate-950/48 p-4">{`scenario: ${scenarioId}`}</div>
              <div className="rounded-2xl border border-white/8 bg-slate-950/48 p-4">{`rate_rule: utilization>90 => +1.8%`}</div>
            </div>
          </GlassCard>
        </div>
      </section>
    </AppShell>
  );
}
