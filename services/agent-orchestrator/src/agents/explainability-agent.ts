import type { AllocationMove } from "@aegis/shared";

import { QwenClient } from "../integrations/qwen.js";
import { ZaiClient } from "../integrations/zai.js";

export class ExplainabilityAgent {
  constructor(
    private readonly qwen = new QwenClient(),
    private readonly zai = new ZaiClient()
  ) {}

  async run(move: AllocationMove) {
    const qwenReasoning = await this.qwen.reason(
      `Explain why Aegis AI rotated ${move.amountUsd} ${move.asset} from ${move.fromProtocol} to ${move.toProtocol}.`
    );

    const summary = await this.zai.summarize("Allocation summary", [
      move.reason,
      `Expected gain ${move.expectedGainBps} bps.`,
      `Confidence ${Math.round(move.confidence * 100)}%.`
    ]);

    return `${qwenReasoning.completion} ${summary.summary}`;
  }
}

