export interface GithubEvent {
    id: string;
    githubEventId: string;
    repoName: string;
    repositoryId: string;
    commitSha?: string | null;
    branch?: string | null;
    status: string; // 'pending', 'success', 'failure', etc.
    eventType: "push" | "pull_request" | "workflow_run"; // 'push', 'pull_request', 'workflow_run'
    message?: string | null;
    author?: string | null;

    createdAt: string;
    updatedAt: string;
}
