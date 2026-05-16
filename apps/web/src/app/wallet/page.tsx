import { dashboardMock } from "@/lib/demo-data";

import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/ui/card";
import { formatCompactCurrency } from "@/lib/utils";

export default function WalletPage() {
  return (
    <AppShell
      currentPath="/wallet"
      title="Wallet Integration"
      subtitle="Inspect the borrower wallet, collateral balances, and debt context used to simulate a refinance from one lending protocol to another."
    >
      <section className="grid gap-4 xl:grid-cols-3">
        {dashboardMock.wallets.map((wallet) => (
          <GlassCard key={`${wallet.address}-${wallet.chain}`} className="rounded-[30px]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-white/42">{wallet.walletProvider}</p>
                <h2 className="mt-2 text-2xl font-semibold">{wallet.chain}</h2>
              </div>
              <div className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-white/65">Connected</div>
            </div>
            <div className="mt-4 rounded-[24px] border border-white/8 bg-slate-950/50 p-4 font-[family:var(--font-mono)] text-sm text-white/78">
              {wallet.address}
            </div>
            <div className="mt-5 space-y-3">
              {wallet.balances.map((balance) => (
                <div key={balance.symbol} className="flex items-center justify-between rounded-[22px] border border-white/8 bg-white/6 px-4 py-3">
                  <div>
                    <p className="font-medium">{balance.symbol}</p>
                    <p className="text-xs text-white/45">{balance.amount.toLocaleString()}</p>
                  </div>
                  <p className="font-medium">{formatCompactCurrency(balance.usdValue)}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        ))}
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]">
        <GlassCard className="rounded-[30px]">
          <p className="text-xs uppercase tracking-[0.26em] text-white/42">Supported Providers</p>
          <h2 className="mt-2 text-2xl font-semibold">Borrower wallet stack</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {["MetaMask", "WalletConnect", "Coinbase Wallet"].map((provider) => (
              <div key={provider} className="rounded-[24px] border border-white/8 bg-slate-950/48 px-4 py-5 text-center">
                <p className="text-lg font-medium">{provider}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="rounded-[30px]">
          <p className="text-xs uppercase tracking-[0.26em] text-white/42">Borrow Migration Controls</p>
          <h2 className="mt-2 text-2xl font-semibold">Simulation permissions</h2>
          <div className="mt-6 space-y-3">
            {[
              "Account switching with per-wallet borrow position context",
              "Collateral portability checks before refinancing",
              "Simulation-first confirmations for debt migration steps",
              "Borrow health-factor validation before execution"
            ].map((item) => (
              <div key={item} className="rounded-[24px] border border-white/8 bg-slate-950/48 px-4 py-4 text-sm leading-6 text-white/68">
                {item}
              </div>
            ))}
          </div>
        </GlassCard>
      </section>
    </AppShell>
  );
}
