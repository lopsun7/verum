import type { ProtocolAllocation } from "@aegis/shared";

import type { PredictionResult } from "../lib/types.js";

function computePredictedApr(pool: ProtocolAllocation) {
  if (pool.utilization > 90) {
    return pool.currentApr + 1.8;
  }

  if (pool.utilization > 80) {
    return pool.currentApr + 0.7;
  }

  if (pool.utilization < 75) {
    return pool.currentApr + 0.2;
  }

  return pool.currentApr + 0.4;
}

function computeRiskPenalty(pool: ProtocolAllocation) {
  const liquidityPenalty = pool.liquidityScore < 70 ? 0.6 : pool.liquidityScore < 80 ? 0.25 : 0;
  const protocolPenalty = pool.riskScore > 25 ? 0.35 : pool.riskScore > 18 ? 0.15 : 0;

  return Number((liquidityPenalty + protocolPenalty).toFixed(2));
}

export class PredictionAgent {
  async run(pools: ProtocolAllocation[]): Promise<PredictionResult[]> {
    return pools.map((pool) => {
      const predictedApr = computePredictedApr(pool);
      const riskPenalty = computeRiskPenalty(pool);

      return {
        protocol: pool.protocol,
        chain: pool.chain,
        currentApr: pool.currentApr,
        predictedApr: Number(predictedApr.toFixed(2)),
        utilization: pool.utilization,
        liquidityScore: pool.liquidityScore,
        riskPenalty,
        rationale:
          pool.utilization > 90
            ? `${pool.protocol} has the lowest current APR, but utilization is above 90%, so the rate may rise soon.`
            : `${pool.protocol} keeps a steadier borrow outlook because utilization and liquidity are more stable.`
      };
    });
  }
}

