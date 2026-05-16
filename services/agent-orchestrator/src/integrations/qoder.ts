export class QoderClient {
  constructor(
    private readonly apiKey = process.env.QODER_API_KEY,
    private readonly repoWikiUrl = process.env.QODER_REPO_WIKI_URL ?? ""
  ) {}

  async syncRepoWiki() {
    return {
      synced: Boolean(this.apiKey && this.repoWikiUrl),
      repoWikiUrl: this.repoWikiUrl || "local-docs-mode"
    };
  }
}

