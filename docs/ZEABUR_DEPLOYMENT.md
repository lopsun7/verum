# Zeabur Deployment Guide

## Services

- `aegis-web`: Next.js frontend
- `aegis-api`: Fastify API and WebSocket broadcaster
- `aegis-agents`: agent orchestration runtime
- `aegis-postgres`: PostgreSQL backing store

## Environment variables

Use the values from [`.env.example`](/Users/lopsun/Documents/New%20project%202/.env.example:1) as the base Zeabur environment set.

Critical values:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_WS_URL`
- `DATABASE_URL`
- `AGENTFIELD_API_KEY`
- `ACTIONBOOK_API_KEY`
- `BRIGHTDATA_API_KEY`
- `QWEN_API_KEY`
- `QODER_API_KEY`
- `ZEABUR_TOKEN`
- `ZAI_API_KEY`
- `RPC_URL`
- `PRIVATE_KEY`

## Deployment steps

1. Create a Zeabur project and add PostgreSQL.
2. Import this repository and map each service path from `zeabur.json`.
3. Apply environment variables to `web`, `api`, and `agents`.
4. Run `npm run prisma:generate -w @aegis/api` and `npm run prisma:push -w @aegis/api` as the API pre-deploy step.
5. Expose ports `3000`, `4000`, and `4100`.
6. Point `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_WS_URL` to the API hostname.

## Production notes

- Put the API and agents behind a private network if possible.
- Replace mock/simulated feeds with live keys before mainnet usage.
- Attach a managed secrets store for wallet private keys or use a signing service.
- Add an approval policy layer before enabling fully autonomous execution in production.

