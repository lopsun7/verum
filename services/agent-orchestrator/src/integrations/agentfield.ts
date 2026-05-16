export class AgentFieldClient {
  constructor(
    private readonly apiKey = process.env.AGENTFIELD_API_KEY,
    private readonly projectId = process.env.AGENTFIELD_PROJECT_ID ?? "aegis-ai"
  ) {}

  async dispatchTask(agent: string, payload: Record<string, unknown>) {
    return {
      agent,
      projectId: this.projectId,
      accepted: Boolean(this.apiKey),
      payload
    };
  }

  async shareMemory(namespace: string, state: Record<string, unknown>) {
    return {
      namespace,
      synchronized: true,
      state
    };
  }
}

