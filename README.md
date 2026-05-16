# Verum

Verum is an autonomous AI-powered DeFi borrow rate optimizer. It analyzes borrow APRs across lending pools, predicts short-term interest-rate movement, chooses the best risk-adjusted venue, and simulates how a borrower would migrate debt to the lowest predicted or currently available borrowing cost.

## Product focus

Verum is built as a multi-agent DeFi lending optimizer:

- `RateDataAgent` collects pool data from Aave, Compound, Morpho, and Spark.
- `PredictionAgent` forecasts near-term borrow APR movement from utilization and liquidity conditions.
- `DecisionAgent` selects the best risk-adjusted venue under user-defined constraints.
- `ExecutionAgent` simulates refinancing steps and returns a fake transaction receipt for the demo.

For the hackathon demo, the market runs on fake chain state and editable mock data so the app stays highly interactive without needing real onchain execution.

## Repo structure

- `apps/web`: Next.js 15 frontend with a cinematic borrower dashboard, mobile navigation, and interactive fake-chain simulation.
- `apps/api`: Fastify API with WebSocket-style simulated recommendation updates.
- `services/agent-orchestrator`: current TypeScript agent loop used by the demo.
- `services/agentforge-runtime`: AgentForge-based runtime scaffold for future agent development using YAML Cogs, personas, and memory-driven orchestration.
- `packages/shared`: shared borrow-market types and demo payloads.
- `packages/contracts`: optional Solidity vault and execution scaffolding kept for future onchain expansion.

## Tech stack

Implemented in code today:

- `Next.js 15`
- `React`
- `Tailwind CSS`
- `Framer Motion`
- `Recharts`
- `Fastify`
- `TypeScript`
- `Prisma`
- `PostgreSQL` schema scaffolding
- `Solidity` / `Hardhat`

Integrated or scaffolded for the agent roadmap:

- `AgentForge`: primary framework for future agent development with Cogs, personas, and YAML-first orchestration
- `AgentField`: async orchestration and shared memory coordination layer
- `Actionbook`: fallback browser automation for protocol actions
- `Bright Data`: market, governance, and sentiment ingestion
- `Qwen Cloud`: reasoning-heavy policy and explainability layer
- `Qoder`: repo wiki and AI engineering workflow support
- `Z.ai / GLM`: reporting, summaries, and multimodal brief generation
- `Zeabur`: production backend deployment target

## Demo scenario

The starter market uses mock USDC borrow data:

- Aave: `6.4%`
- Compound: `5.7%`
- Morpho: `5.1%`
- Spark: `5.9%`

Prediction rules:

- utilization `> 90%` => `current APR + 1.8%`
- utilization `> 80%` => `current APR + 0.7%`
- utilization `< 75%` => `current APR + 0.2%`
- low liquidity adds a risk penalty

Base recommendation:

- Morpho is cheapest now, but its utilization is too high.
- Compound wins on a risk-adjusted predicted basis.
- The simulated recommendation moves a `5,000 USDC` borrow position from Aave to Compound.

## Interactive demo controls

The deployed frontend demo is intentionally adjustable:

- edit mock APR, utilization, liquidity, and risk per pool
- randomize market conditions
- switch scenarios such as `Morpho Spike` and `Liquidity Crunch`
- set agent constraints like max utilization or minimum liquidity
- simulate autonomous refinancing with a fake transaction hash

## AgentForge development path

The current interactive app still uses the TypeScript demo agent loop so it can stay lightweight on Vercel, but the repo now also includes an AgentForge-aligned runtime scaffold at:

- [services/agentforge-runtime/README.md](/Users/lopsun/Documents/New project 2/services/agentforge-runtime/README.md:1)
- [services/agentforge-runtime/.agentforge/cogs/verum_borrow_optimizer.yaml](/Users/lopsun/Documents/New project 2/services/agentforge-runtime/.agentforge/cogs/verum_borrow_optimizer.yaml:1)
- [docs/AGENTFORGE_RUNTIME.md](/Users/lopsun/Documents/New project 2/docs/AGENTFORGE_RUNTIME.md:1)

That path is meant for real multi-agent development once you want to move beyond the fake-chain demo.

## Quick start

```bash
npm install
npm run build -w @aegis/web
```

## Vercel deployment

The frontend can be deployed standalone on Vercel from the repo root because `vercel.json` forces Vercel to build only `apps/web`.

## Backend path

If you want real AI and live protocol data later:

- keep `apps/web` on Vercel
- deploy `apps/api` and `services/agent-orchestrator` or `services/agentforge-runtime` on Zeabur, Railway, Render, or Fly.io
- add real model/provider keys in `.env`
