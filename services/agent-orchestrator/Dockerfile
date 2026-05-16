FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json tsconfig.base.json ./
COPY services/agent-orchestrator/package.json services/agent-orchestrator/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN npm install

FROM node:24-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build -w @aegis/shared && npm run build -w @aegis/agents

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/services/agent-orchestrator/dist ./services/agent-orchestrator/dist
CMD ["node", "services/agent-orchestrator/dist/index.js"]

