const prisma = require("../config/prisma");
const { parseGithubEvents } = require("./webhook.parser");
const { emitToAll } = require("../socket/emitter");

async function processGithubWebhookEvents(githubEvent, payload) {
    const eventData = parseGithubEvents(githubEvent, payload);

    if (!eventData) {
        return;
    }

    const savedEvent = await prisma.event.upsert({
        where: {
            githubEventId: eventData.githubEventId,
        },
        update: {
            status: eventData.status,
        },
        create: eventData,
    });

    console.log(
        `Saved/Updated new ${githubEvent} for ${eventData.repoName} with status: ${eventData.status}`,
    );

    emitToAll("new_github_event", savedEvent);
}

module.exports = { processGithubWebhookEvents };
