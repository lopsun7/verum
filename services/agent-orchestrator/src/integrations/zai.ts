export class ZaiClient {
  constructor(
    private readonly apiKey = process.env.ZAI_API_KEY,
    private readonly model = process.env.GLM_MODEL ?? "glm-4.6"
  ) {}

  async summarize(title: string, bullets: string[]) {
    return {
      model: this.model,
      available: Boolean(this.apiKey),
      summary: `${title}: ${bullets.join(" ")}`
    };
  }
}

