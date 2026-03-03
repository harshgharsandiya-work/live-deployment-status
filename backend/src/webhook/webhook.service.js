const prisma = require("../config/prisma");
const { parseGithubEvents } = require("./webhook.parser");
const { emitToAll } = require("../socket/emitter");

async function processGithubWebhookEvents(githubEvent, payload) {
    const eventData = parseGithubEvents(githubEvent, payload);

    if (!eventData) {
        return;
    }

    const savedEvent = await prisma.event.create({
        data: eventData,
    });

    console.log(`Saved new ${githubEvent} for ${eventData.repoName}`);

    emitToAll("new_github_event", savedEvent);
}

module.exports = { processGithubWebhookEvents };
