import type { AllocationMove } from "@aegis/shared";

import type { ExecutionPlan } from "../lib/types.js";

export class ActionbookClient {
  constructor(private readonly apiKey = process.env.ACTIONBOOK_API_KEY) {}

  async buildFallbackPlan(move: AllocationMove): Promise<ExecutionPlan> {
    return {
      fallbackMode: this.apiKey ? "actionbook" : "api",
      recommendedWindow: "next-30-min",
      simulatedTxHash: move.simulatedTxHash,
      steps: move.steps
    };
  }
}
