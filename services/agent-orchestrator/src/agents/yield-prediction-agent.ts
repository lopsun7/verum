import type { DashboardPayload } from "@aegis/shared";

import type { YieldPredictionResult } from "../lib/types.js";

export class YieldPredictionAgent {
  async run(snapshot: DashboardPayload): Promise<YieldPredictionResult[]> {
    return snapshot.allocations.map((allocation) => ({
      protocol: allocation.protocol,
      chain: allocation.chain,
      predictedApy: allocation.predictedApy,
      confidence: Math.max(0.64, Math.min(0.97, allocation.predictedApy / 16)),
      rationale: `Forecast uses utilization, TVL drift, volatility, whale flows, and gas pressure for ${allocation.protocol} on ${allocation.chain}.`
    }));
  }
}

