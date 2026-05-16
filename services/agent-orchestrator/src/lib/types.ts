import type { AllocationMove, DashboardPayload, ProtocolAllocation } from "@aegis/shared";

export interface MarketIntel {
  protocolMentions: string[];
  governanceAlerts: string[];
  twitterSentiment: number;
  liquiditySignals: Array<{
    protocol: string;
    signal: string;
    confidence: number;
  }>;
}

export interface RateDataResult {
  pools: ProtocolAllocation[];
  source: "mock-json";
}

export interface PredictionResult {
  protocol: ProtocolAllocation["protocol"];
  chain: ProtocolAllocation["chain"];
  currentApr: number;
  predictedApr: number;
  utilization: number;
  liquidityScore: number;
  riskPenalty: number;
  rationale: string;
}

export interface RecommendationDecision {
  fromProtocol: ProtocolAllocation["protocol"];
  toProtocol: ProtocolAllocation["protocol"];
  fromChain: ProtocolAllocation["chain"];
  toChain: ProtocolAllocation["chain"];
  amountUsd: number;
  expectedMonthlySavingsUsd: number;
  confidence: number;
  reason: string;
}

export interface ExecutionPlan {
  fallbackMode: "api" | "actionbook";
  steps: string[];
  simulatedTxHash: string;
  recommendedWindow: string;
}

export interface AutonomousCycleResult {
  snapshot: DashboardPayload["metric"];
  rateData: RateDataResult;
  predictions: PredictionResult[];
  decision: RecommendationDecision;
  execution: ExecutionPlan;
  moves: AllocationMove[];
}
