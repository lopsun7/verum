import type { AllocationMove, DashboardPayload, ProtocolAllocation, RiskVector } from "@aegis/shared";

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

export interface YieldPredictionResult {
  protocol: ProtocolAllocation["protocol"];
  chain: ProtocolAllocation["chain"];
  predictedApy: number;
  confidence: number;
  rationale: string;
}

export interface RiskAnalysisResult {
  protocol: RiskVector["protocol"];
  healthScore: number;
  exploitProbability: number;
  anomaly: boolean;
  rationale: string;
}

export interface ExecutionPlan {
  fallbackMode: "api" | "actionbook";
  route: string;
  bridge: string;
  batchSize: number;
  mevPenaltyBps: number;
}

export interface AutonomousCycleResult {
  snapshot: DashboardPayload["metric"];
  intel: MarketIntel;
  predictions: YieldPredictionResult[];
  risks: RiskAnalysisResult[];
  execution: ExecutionPlan;
  moves: AllocationMove[];
  explanation: string;
}

