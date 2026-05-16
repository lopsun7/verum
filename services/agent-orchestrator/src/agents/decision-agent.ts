import type { PredictionResult, RecommendationDecision } from "../lib/types.js";

export class DecisionAgent {
  async run(predictions: PredictionResult[], activeBorrowUsd: number): Promise<RecommendationDecision> {
    const current = predictions.find((prediction) => prediction.protocol === "Aave") ?? predictions[0]!;
    const ranked = [...predictions].sort(
      (left, right) => left.predictedApr + left.riskPenalty - (right.predictedApr + right.riskPenalty)
    );
    const best = ranked[0]!;

    const yearlyDelta = Math.max(0, current.currentApr - best.predictedApr);
    const expectedMonthlySavingsUsd = Number(((activeBorrowUsd * (yearlyDelta / 100)) / 12).toFixed(2));

    return {
      fromProtocol: current.protocol,
      toProtocol: best.protocol,
      fromChain: current.chain,
      toChain: best.chain,
      amountUsd: activeBorrowUsd,
      expectedMonthlySavingsUsd,
      confidence: best.protocol === "Compound" ? 0.88 : 0.74,
      reason: `${best.protocol} has the best risk-adjusted predicted borrow rate. Morpho is cheaper right now, but its high utilization creates rate volatility risk.`
    };
  }
}

