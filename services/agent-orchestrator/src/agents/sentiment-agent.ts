import type { MarketIntel } from "../lib/types.js";
import { BrightDataClient } from "../integrations/brightdata.js";

export class SentimentAgent {
  constructor(private readonly brightData = new BrightDataClient()) {}

  async run(): Promise<MarketIntel> {
    return this.brightData.collectMarketIntel();
  }
}

