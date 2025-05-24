"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitService = void 0;
const rest_1 = require("@octokit/rest");
class GitService {
    octokit;
    constructor(token) {
        this.octokit = new rest_1.Octokit({ auth: token });
    }
    async createPullRequest(cursorRule) {
        // TODO: Implement PR creation
    }
}
exports.GitService = GitService;
