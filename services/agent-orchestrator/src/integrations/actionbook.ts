import type { AllocationMove } from "@aegis/shared";

import type { ExecutionPlan } from "../lib/types.js";

export class ActionbookClient {
  constructor(private readonly apiKey = process.env.ACTIONBOOK_API_KEY) {}

  async buildFallbackPlan(move: AllocationMove): Promise<ExecutionPlan> {
    return {
      fallbackMode: this.apiKey ? "actionbook" : "api",
      route: `${move.fromChain} -> ${move.toChain}`,
      bridge: "Across + 1inch protected route",
      batchSize: 2,
      mevPenaltyBps: 11
    };
  }
}

