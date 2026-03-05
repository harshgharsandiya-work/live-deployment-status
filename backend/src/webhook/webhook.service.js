const prisma = require("../config/prisma");
const { parseGithubEvents } = require("./webhook.parser");
const { emitToAll, emitToRoom } = require("../socket/emitter");

async function processGithubWebhookEvents(githubEvent, payload) {
    const eventData = parseGithubEvents(githubEvent, payload);

    if (!eventData) {
        return;
    }

    // find repository
    const repository = await prisma.repositories.findUnique({
        where: {
            githubRepoId: eventData.githubRepoId,
        },
    });

    if (!repository) {
        console.error(
            `Repository ${eventData.repoName} not found in database. Cannot save event.`,
        );
        return;
    }

    const savedEvent = await prisma.githubEvent.upsert({
        where: {
            githubEventId: eventData.githubEventId,
        },
        update: {
            status: eventData.status,
        },
        create: {
            ...eventData,
            repositoryId: repository.id,
        },
    });

    // emitToAll("new_github_event", savedEvent);
    emitToRoom(`repo_${repository.id}`, "new_github_event", savedEvent);

    console.log(
        `Saved/Updated new ${githubEvent} for ${eventData.repoName} with status: ${eventData.status}`,
    );
}

module.exports = { processGithubWebhookEvents };
