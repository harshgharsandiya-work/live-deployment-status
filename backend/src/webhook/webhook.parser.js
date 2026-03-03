function parseGithubEvents(githubEvent, payload) {
    const supportedEvents = ["push", "pull_request", "workflow_run"];

    if (!supportedEvents.includes(githubEvent)) {
        return null;
    }

    let eventData = {
        repoName: payload.repository?.name || "unknown-repo",
        eventType: githubEvent,
        status: "pending",
        githubEventId: "",
    };

    if (githubEvent === "push") {
        eventData.githubEventId = payload.after;
        eventData.commitSha = payload.after;
        eventData.branch = payload.ref?.replace("refs/heads/", "");
        eventData.message = payload.head_commit?.message;
        eventData.author =
            payload.head_commit?.author?.name ||
            payload.head_commit?.author?.username;
        eventData.status = "success";
    } else if (githubEvent === "pull_request") {
        eventData.githubEventId = payload.pull_request?.id.toString();
        eventData.branch = payload.pull_request?.head?.ref;
        eventData.message = payload.pull_request?.title;
        eventData.author = payload.pull_request?.user?.login;
        eventData.status = payload.action; //// e.g., 'opened', 'closed', 'synchronized'
    } else if (githubEvent === "workflow_run") {
        eventData.githubEventId = payload.workflow_run?.id.toString();
        eventData.commitSha = payload.workflow_run?.head_sha;
        eventData.branch = payload.workflow_run?.head_branch;
        eventData.message = payload.workflow_run?.display_title;
        eventData.author = payload.workflow_run?.actor?.login;

        // Workflow runs have a 'status' (queued, in_progress, completed)
        // and a 'conclusion' (success, failure)
        eventData.status =
            payload.workflow_run?.conclusion || payload.workflow_run?.status;
    }

    return eventData;
}

module.exports = { parseGithubEvents };
