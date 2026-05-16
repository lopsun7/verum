"use client";

import Link from "next/link";
import { ArrowRight, Bot, Cable, ChartNoAxesCombined, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { motion } from "framer-motion";

import { dashboardMock } from "@/lib/demo-data";

import { Pill } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { formatCompactCurrency, formatPercent } from "@/lib/utils";

const featureCards = [
  {
    title: "Borrow APR Forecasting",
    icon: ChartNoAxesCombined,
    copy: "Predict short-term borrow APR moves before utilization spikes turn the cheapest pool into the most expensive one."
  },
  {
    title: "Liquidity-Aware Pool Ranking",
    icon: ShieldCheck,
    copy: "Compare current APR, predicted APR, liquidity depth, and risk-adjusted borrower stability across protocols."
  },
  {
    title: "Autonomous Migration Plans",
    icon: Zap,
    copy: "Generate a borrower-ready refinance checklist without touching mainnet funds during the hackathon demo."
  },
  {
    title: "Four-Agent Reasoning Stack",
    icon: Cable,
    copy: "RateDataAgent, PredictionAgent, DecisionAgent, and ExecutionAgent divide the optimization workflow cleanly."
  }
];

const protocols = ["Aave", "Morpho", "Compound", "Spark"];

export function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#050816] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,147,64,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.14),transparent_24%)]" />
      <div className="relative mx-auto max-w-[1400px] px-4 py-6 md:px-8">
        <header className="mb-14 flex items-center justify-between rounded-[30px] border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff8f3f] to-[#ffc07d] text-lg font-semibold text-slate-950">
              V
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.24em] uppercase text-white/75">Verum</p>
              <p className="text-xs text-white/45">Autonomous DeFi borrow optimizer</p>
            </div>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <Link href="/dashboard" className="text-sm text-white/70 transition hover:text-white">
              Platform
            </Link>
            <Link href="/risk-terminal" className="text-sm text-white/70 transition hover:text-white">
              Risk
            </Link>
            <Button variant="secondary">Book Demo</Button>
          </div>
        </header>

        <div className="mb-10 flex gap-3 md:hidden">
          <Link href="/dashboard" className={buttonVariants({ variant: "primary" })}>
            Launch Terminal
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/risk-terminal" className={buttonVariants({ variant: "secondary" })}>
            Risk
          </Link>
        </div>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="pt-4">
            <Pill className="mb-5 border-[#ff9340]/25 bg-[#ff9340]/12 text-[#ffd4b0]">Short-term DeFi borrow intelligence</Pill>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
              Autonomous Borrow Rate Optimization
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/62 md:text-lg">
              Verum analyzes borrow APRs across DeFi money markets, predicts short-term rate changes, and recommends where a borrower should move debt to minimize expected interest cost.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/dashboard" className={buttonVariants({ variant: "primary", className: "min-w-44" })}>
                Launch Terminal
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Button variant="secondary" className="min-w-44">
                Watch Demo
              </Button>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                ["Active Borrow", formatCompactCurrency(dashboardMock.metric.activeBorrowUsd)],
                ["Best Predicted APR", formatPercent(dashboardMock.metric.bestPredictedBorrowApr)],
                ["Projected Savings", formatCompactCurrency(dashboardMock.metric.projectedMonthlySavingsUsd)]
              ].map(([label, value]) => (
                <GlassCard key={label} className="rounded-[26px] p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-white/42">{label}</p>
                  <p className="mt-3 text-3xl font-semibold">{value}</p>
                </GlassCard>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,15,29,0.94),rgba(8,15,29,0.7))] p-6 shadow-[0_35px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
          >
            <div className="absolute inset-0 rounded-[34px] bg-[radial-gradient(circle_at_top,rgba(255,147,64,0.22),transparent_34%)]" />
            <div className="relative">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs tracking-[0.32em] text-white/42 uppercase">Borrow Pulse</p>
                  <h2 className="mt-2 text-2xl font-semibold">Rate Routing Engine</h2>
                </div>
                <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                  Live
                </div>
              </div>

              <div className="relative h-[360px] overflow-hidden rounded-[28px] border border-white/8 bg-slate-950/50 p-4">
                <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:36px_36px]" />
                <div className="relative grid h-full place-items-center">
                  {[
                    { label: "Aave", x: "8%", y: "12%" },
                    { label: "Morpho", x: "66%", y: "12%" },
                    { label: "Compound", x: "72%", y: "48%" },
                    { label: "Spark", x: "18%", y: "58%" },
                    { label: "Decision AI", x: "34%", y: "34%" }
                  ].map((node, index) => (
                    <motion.div
                      key={node.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.08, duration: 0.5 }}
                      className="absolute"
                      style={{ left: node.x, top: node.y }}
                    >
                      <div className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm shadow-[0_0_40px_rgba(255,147,64,0.2)] backdrop-blur">
                        {node.label}
                      </div>
                    </motion.div>
                  ))}
                  {[0, 1, 2, 3].map((line) => (
                    <motion.div
                      key={line}
                      animate={{ opacity: [0.22, 0.62, 0.22], scaleX: [0.94, 1.02, 0.94] }}
                      transition={{ repeat: Infinity, duration: 2.5 + line * 0.4, ease: "easeInOut" }}
                      className="absolute h-px origin-left bg-gradient-to-r from-transparent via-[#ff9340] to-transparent"
                      style={{
                        width: `${160 + line * 38}px`,
                        left: `${90 + line * 28}px`,
                        top: `${90 + line * 48}px`,
                        transform: `rotate(${line % 2 === 0 ? 22 : -18}deg)`
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {[
                  ["AI Confidence", `${dashboardMock.metric.aiConfidence}%`],
                  ["Execution Ready", `${dashboardMock.metric.executionReadiness}%`],
                  ["Tracked Protocols", "4 venues"]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[24px] border border-white/8 bg-white/6 p-4">
                    <p className="text-xs text-white/40">{label}</p>
                    <p className="mt-2 text-xl font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        <section className="mt-20">
          <div className="ticker-mask overflow-hidden rounded-full border border-white/8 bg-white/5 py-3">
            <div className="ticker-track flex items-center gap-10 whitespace-nowrap text-sm text-white/68">
              {dashboardMock.allocations.concat(dashboardMock.allocations).map((allocation, index) => (
                <span key={`${allocation.protocol}-${index}`} className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#ff9340]" />
                  {allocation.protocol} {allocation.asset} borrow forecast {formatPercent(allocation.predictedApr)}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-20 grid gap-5 lg:grid-cols-4">
          {featureCards.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.08 }}
              >
                <GlassCard className="h-full rounded-[28px]">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ff9340]/14 text-[#ffb36b]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-semibold">{feature.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-white/62">{feature.copy}</p>
                </GlassCard>
              </motion.div>
            );
          })}
        </section>

        <section className="mt-20 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <GlassCard className="rounded-[30px]">
            <p className="text-xs uppercase tracking-[0.28em] text-white/42">Operational Coverage</p>
            <h2 className="mt-4 text-3xl font-semibold">Four-agent borrower control plane</h2>
            <div className="mt-8 space-y-4">
              {[
                ["RateDataAgent", "Collects lending pool data across protocols and normalizes current borrow APRs."],
                ["PredictionAgent", "Applies utilization and liquidity rules to estimate short-term borrow rate movement."],
                ["DecisionAgent", "Chooses the best risk-adjusted pool instead of simply chasing the lowest current APR."],
                ["ExecutionAgent", "Produces a simulated debt migration plan and fake transaction receipt for the borrower."],
                ["Actionbook", "Reserved for future browser-based execution if protocol APIs break."],
                ["Zeabur / Vercel", "Deploy the agent backend and the dashboard separately for the hackathon demo."]
              ].map(([title, copy]) => (
                <div key={title} className="rounded-[24px] border border-white/8 bg-slate-950/45 px-5 py-4">
                  <p className="text-lg font-medium">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-white/60">{copy}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="rounded-[30px]">
            <p className="text-xs uppercase tracking-[0.28em] text-white/42">Integrated Venues</p>
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              {protocols.map((protocol) => (
                <div
                  key={protocol}
                  className="flex h-28 items-center justify-center rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] text-lg font-medium text-white/82"
                >
                  {protocol}
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[26px] border border-[#ff9340]/20 bg-[#ff9340]/8 p-6">
              <div className="flex items-start gap-4">
                <Bot className="mt-1 h-6 w-6 text-[#ffb36b]" />
                <div>
                  <p className="text-lg font-semibold">Every debt migration is explainable.</p>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-white/68">
                    The DecisionAgent compares current APR, predicted APR, utilization, liquidity, and risk level before recommending where the borrower should refinance.
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>
        </section>
      </div>
    </div>
  );
}
