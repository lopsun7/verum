import type { FastifyInstance } from "fastify";

import { getDashboardPayload } from "../services/dashboard-service.js";

export async function registerDashboardRoutes(app: FastifyInstance) {
  app.get("/health", async () => ({
    status: "ok",
    service: "aegis-api"
  }));

  app.get("/api/dashboard", async () => getDashboardPayload());

  app.get("/api/agents/summary", async () => ({
    activeAgents: 5,
    orchestrationLayer: "AgentField",
    fallbackExecutor: "Actionbook",
    intelligenceSources: ["Bright Data", "DefiLlama", "Governance Forums", "X/Twitter"]
  }));

  app.post("/api/rebalance/simulate", async () => ({
    ok: true,
    simulationId: "sim-aegis-001",
    expectedGainBps: 96,
    mevPenaltyBps: 11,
    recommendedWindow: "next-30-min"
  }));
}
