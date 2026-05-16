export class QwenClient {
  constructor(private readonly apiKey = process.env.QWEN_API_KEY) {}

  async reason(prompt: string) {
    return {
      provider: "Qwen Cloud",
      available: Boolean(this.apiKey),
      completion: `Qwen reasoning trace: ${prompt}`
    };
  }
}

