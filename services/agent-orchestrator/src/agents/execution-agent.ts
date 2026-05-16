import type { AllocationMove } from "@aegis/shared";

import type { ExecutionPlan } from "../lib/types.js";
import { ActionbookClient } from "../integrations/actionbook.js";

export class ExecutionAgent {
  constructor(private readonly actionbook = new ActionbookClient()) {}

  async run(move: AllocationMove): Promise<ExecutionPlan> {
    return this.actionbook.buildFallbackPlan(move);
  }
}

