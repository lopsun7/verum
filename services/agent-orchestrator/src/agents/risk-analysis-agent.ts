import type { DashboardPayload } from "@aegis/shared";

import type { RiskAnalysisResult } from "../lib/types.js";

export class RiskAnalysisAgent {
  async run(snapshot: DashboardPayload): Promise<RiskAnalysisResult[]> {
    return snapshot.riskVectors.map((risk) => ({
      protocol: risk.protocol,
      healthScore: Math.round(
        (risk.smartContractRisk +
          risk.auditCoverage +
          risk.liquidityHealth +
          risk.governanceDecentralization +
          risk.badDebtRisk) /
          5
      ),
      exploitProbability: risk.exploitProbability,
      anomaly: risk.exploitProbability >= 25 || risk.oracleDependency >= 75,
      rationale: `Health score incorporates audits, liquidity, governance, oracle dependency, and bad debt posture for ${risk.protocol}.`
    }));
  }
}

