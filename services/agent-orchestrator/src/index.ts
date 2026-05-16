import "dotenv/config";

import Fastify from "fastify";

import { dashboardMock } from "@aegis/shared";

import { ExecutionAgent } from "./agents/execution-agent.js";
import { ExplainabilityAgent } from "./agents/explainability-agent.js";
import { RiskAnalysisAgent } from "./agents/risk-analysis-agent.js";
import { SentimentAgent } from "./agents/sentiment-agent.js";
import { YieldPredictionAgent } from "./agents/yield-prediction-agent.js";
import { AgentFieldClient } from "./integrations/agentfield.js";
import { BrightDataClient } from "./integrations/brightdata.js";
import { QoderClient } from "./integrations/qoder.js";
import type { AutonomousCycleResult } from "./lib/types.js";

const app = Fastify({ logger: true });
const port = Number(process.env.AGENT_PORT ?? 4100);

const agentField = new AgentFieldClient();
const brightData = new BrightDataClient();
const qoder = new QoderClient();

const yieldAgent = new YieldPredictionAgent();
const riskAgent = new RiskAnalysisAgent();
const sentimentAgent = new SentimentAgent(brightData);
const executionAgent = new ExecutionAgent();
const explainabilityAgent = new ExplainabilityAgent();

async function runAutonomousCycle(): Promise<AutonomousCycleResult> {
  const [predictions, risks, intel, execution] = await Promise.all([
    yieldAgent.run(dashboardMock),
    riskAgent.run(dashboardMock),
    sentimentAgent.run(),
    executionAgent.run(dashboardMock.moves[0]!)
  ]);

  await agentField.dispatchTask("yield-prediction-agent", {
    marketState: dashboardMock.metric
  });
  await agentField.shareMemory("treasury-state", {
    protectedCapital: dashboardMock.metric.protectedCapital,
    aiConfidence: dashboardMock.metric.aiConfidence,
    preferredChain: "Base"
  });
  await qoder.syncRepoWiki();

  const explanation = await explainabilityAgent.run(dashboardMock.moves[0]!);

  return {
    snapshot: dashboardMock.metric,
    intel,
    predictions,
    risks,
    execution,
    moves: dashboardMock.moves,
    explanation
  };
}

app.get("/health", async () => ({
  status: "ok",
  service: "aegis-agents"
}));

app.get("/api/integrations", async () => ({
  agentField: Boolean(process.env.AGENTFIELD_API_KEY),
  actionbook: Boolean(process.env.ACTIONBOOK_API_KEY),
  brightData: brightData.getSourceSummary(),
  qwen: Boolean(process.env.QWEN_API_KEY),
  qoder: Boolean(process.env.QODER_API_KEY),
  zeabur: Boolean(process.env.ZEABUR_TOKEN),
  glm: Boolean(process.env.ZAI_API_KEY)
}));

app.post("/api/agents/run-cycle", async () => runAutonomousCycle());

app.listen({
  port,
  host: "0.0.0.0"
});
