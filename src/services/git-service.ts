import { Octokit } from "@octokit/rest";

export class GitService {
  private octokit: Octokit;

  constructor(token: string) {
    this.octokit = new Octokit({ auth: token });
  }

  async createPullRequest(cursorRule: any): Promise<void> {
    // TODO: Implement PR creation
  }
}
