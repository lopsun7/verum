# AgentForge Runtime Plan

Verum now includes an AgentForge-aligned runtime scaffold for future agent development while keeping the current Vercel demo lightweight and interactive.

## Why this exists

The TypeScript demo loop is great for:

- fake-chain market simulation
- rapid UI iteration
- hackathon demos on Vercel

AgentForge is better for the next stage:

- YAML-first multi-agent workflows
- explicit agent personas
- memory-backed orchestration
- easier model swapping across different reasoning steps

## Verum's AgentForge mapping

`VerumBorrowOptimizerCog`

1. `rate_data`
   Reads mock pool state or live data adapters and normalizes lending pool inputs.
2. `prediction`
   Applies short-term APR forecasting logic and liquidity/risk penalties.
3. `decision`
   Chooses the venue with the best risk-adjusted borrow cost under user constraints.
4. `execution`
   Produces a simulated refinance plan and fake transaction receipt.

## Files

- `services/agentforge-runtime/.agentforge/cogs/verum_borrow_optimizer.yaml`
- `services/agentforge-runtime/.agentforge/prompts/verum_rate_data_agent.yaml`
- `services/agentforge-runtime/.agentforge/prompts/verum_prediction_agent.yaml`
- `services/agentforge-runtime/.agentforge/prompts/verum_decision_agent.yaml`
- `services/agentforge-runtime/.agentforge/prompts/verum_execution_agent.yaml`
- `services/agentforge-runtime/.agentforge/personas/verum_credit_pm.yaml`
- `services/agentforge-runtime/app/run_demo.py`

## Runtime strategy

- Short term: keep the current TypeScript simulator as the app-facing demo engine.
- Medium term: have `apps/api` call the Python AgentForge runtime for recommendation cycles.
- Long term: replace the rule-only prediction step with real model inference and live data adapters.

## Supported demo inputs

The scaffold is designed around:

- manual pool edits
- randomized markets
- borrower amount changes
- risk and liquidity constraints
- scenario presets

That keeps the UI fully interactive while making the underlying agent architecture much closer to a real autonomous system.
