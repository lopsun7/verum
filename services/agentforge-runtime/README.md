# Verum AgentForge Runtime

This folder contains the AgentForge-based development path for Verum's multi-agent borrower optimizer.

It is intentionally separate from the current TypeScript demo runtime:

- the `apps/web` experience stays fast and Vercel-friendly
- the AgentForge path provides a more realistic framework for future agent development

## Goal

Use AgentForge's `Cog + Agent + Memory + Persona` model to orchestrate Verum's four-agent flow:

1. `RateDataAgent`
2. `PredictionAgent`
3. `DecisionAgent`
4. `ExecutionAgent`

## What's included

- `.agentforge/cogs/verum_borrow_optimizer.yaml`
- `.agentforge/prompts/*.yaml`
- `.agentforge/personas/verum_credit_pm.yaml`
- `app/run_demo.py`
- `data/mock_market.json`

## Install

```bash
cd services/agentforge-runtime
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Run

```bash
cd services/agentforge-runtime
python app/run_demo.py
```

## Notes

- This scaffold is built for future integration and architecture clarity.
- The current production demo still uses the TypeScript simulator in `apps/web`.
- You can later wire `apps/api` to call this runtime instead of the TypeScript agent loop.
