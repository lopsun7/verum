"use client";

import Link from "next/link";
import { Activity, BrainCircuit, LayoutDashboard, ShieldAlert, Wallet } from "lucide-react";

import { useSimulation } from "@/components/providers/simulation-provider";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/allocation-engine", label: "AI Engine", icon: BrainCircuit },
  { href: "/risk-terminal", label: "Risk Terminal", icon: ShieldAlert },
  { href: "/agent-console", label: "Agent Console", icon: Activity },
  { href: "/wallet", label: "Wallet", icon: Wallet }
];

export function AppShell({
  currentPath,
  title,
  subtitle,
  children
}: {
  currentPath: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const { blockNumber, autoMode } = useSimulation();

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,147,64,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.12),transparent_22%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-[1600px] gap-6 px-4 py-4 md:px-6 lg:px-8">
        <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-72 shrink-0 flex-col rounded-[34px] border border-white/10 bg-slate-950/70 p-5 shadow-[0_22px_80px_rgba(2,6,23,0.55)] backdrop-blur-xl lg:flex">
          <Link href="/" className="mb-8 flex items-center gap-3 rounded-3xl border border-white/8 bg-white/5 px-4 py-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff8f3f] to-[#ffbf7a] text-lg font-semibold text-slate-950">
              V
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] text-white/75 uppercase">Verum</p>
              <p className="text-xs text-white/45">Autonomous borrow OS</p>
            </div>
          </Link>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = currentPath === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition",
                    active
                      ? "border border-[#ff9340]/30 bg-[#ff9340]/14 text-white shadow-[0_18px_40px_rgba(255,147,64,0.12)]"
                      : "text-white/62 hover:bg-white/6 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,147,64,0.18),rgba(255,147,64,0.05))] p-5">
            <p className="text-xs tracking-[0.28em] text-white/45 uppercase">Borrow Defense</p>
            <p className="mt-3 text-2xl font-semibold">Volatility Guardrails</p>
            <p className="mt-2 text-sm leading-6 text-white/65">
              Migration is blocked when utilization spikes, liquidity drains, or protocol risk rises above the acceptable borrower threshold.
            </p>
          </div>
        </aside>

        <main className="flex-1 py-4 pb-24 lg:pb-4">
          <header className="mb-6 flex flex-col gap-4 rounded-[32px] border border-white/10 bg-white/6 px-6 py-6 backdrop-blur-xl md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs tracking-[0.32em] text-white/45 uppercase">Autonomous Borrowing Intelligence</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-white/62">{subtitle}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 md:w-[420px]">
              <div className="rounded-3xl border border-white/8 bg-slate-950/55 px-4 py-4">
                <p className="text-xs text-white/40">System Status</p>
                <p className="mt-2 text-lg font-semibold text-emerald-300">{autoMode ? "Auto Sim" : "Manual Sim"}</p>
              </div>
              <div className="rounded-3xl border border-white/8 bg-slate-950/55 px-4 py-4">
                <p className="text-xs text-white/40">Live Block</p>
                <p className="mt-2 font-[family:var(--font-mono)] text-lg font-semibold text-white">#{blockNumber}</p>
              </div>
            </div>
          </header>

          {children}
        </main>
      </div>

      <nav className="fixed inset-x-4 bottom-4 z-30 flex items-center justify-between rounded-[26px] border border-white/10 bg-slate-950/90 px-3 py-3 shadow-[0_18px_60px_rgba(2,6,23,0.45)] backdrop-blur-xl lg:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = currentPath === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] transition",
                active ? "bg-[#ff9340]/14 text-white" : "text-white/58"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
