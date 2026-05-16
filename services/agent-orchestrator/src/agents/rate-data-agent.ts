import { dashboardMock } from "@aegis/shared";

import type { RateDataResult } from "../lib/types.js";

export class RateDataAgent {
  async run(): Promise<RateDataResult> {
    return {
      source: "mock-json",
      pools: dashboardMock.allocations
    };
  }
}

