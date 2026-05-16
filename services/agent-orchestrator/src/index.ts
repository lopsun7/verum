import "dotenv/config";

import Fastify from "fastify";

import { dashboardMock } from "@aegis/shared";

import { DecisionAgent } from "./agents/decision-agent.js";
import { ExecutionAgent } from "./agents/execution-agent.js";
import { PredictionAgent } from "./agents/prediction-agent.js";
import { RateDataAgent } from "./agents/rate-data-agent.js";
import { AgentFieldClient } from "./integrations/agentfield.js";
import { BrightDataClient } from "./integrations/brightdata.js";
import { QoderClient } from "./integrations/qoder.js";
import type { AutonomousCycleResult } from "./lib/types.js";

const app = Fastify({ logger: true });
const port = Number(process.env.AGENT_PORT ?? 4100);

const agentField = new AgentFieldClient();
const brightData = new BrightDataClient();
const qoder = new QoderClient();

const rateDataAgent = new RateDataAgent();
const predictionAgent = new PredictionAgent();
const decisionAgent = new DecisionAgent();
const executionAgent = new ExecutionAgent();

async function runAutonomousCycle(): Promise<AutonomousCycleResult> {
  const rateData = await rateDataAgent.run();
  const predictions = await predictionAgent.run(rateData.pools);
  const decision = await decisionAgent.run(predictions, dashboardMock.metric.activeBorrowUsd);
  const execution = await executionAgent.run(decision);

  await agentField.dispatchTask("rate-data-agent", {
    pools: rateData.pools.length,
    source: rateData.source
  });
  await agentField.shareMemory("borrow-state", {
    activeBorrowUsd: dashboardMock.metric.activeBorrowUsd,
    aiConfidence: dashboardMock.metric.aiConfidence,
    recommendedVenue: decision.toProtocol
  });
  await qoder.syncRepoWiki();

  return {
    snapshot: dashboardMock.metric,
    rateData,
    predictions,
    decision,
    execution,
    moves: dashboardMock.moves
  };
}

app.get("/health", async () => ({
  status: "ok",
  service: "verum-agents"
}));

app.get("/api/integrations", async () => ({
  agentField: Boolean(process.env.AGENTFIELD_API_KEY),
  actionbook: Boolean(process.env.ACTIONBOOK_API_KEY),
  brightData: brightData.getSourceSummary(),
  qoder: Boolean(process.env.QODER_API_KEY)
}));

app.post("/api/agents/run-cycle", async () => runAutonomousCycle());

app.listen({
  port,
  host: "0.0.0.0"
});
