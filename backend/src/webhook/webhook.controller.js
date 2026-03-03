const { processGithubWebhookEvents } = require("./webhook.service");

async function handleGithubWebhook(req, res) {
    try {
        const githubEvent = req.headers["x-github-event"];
        const payload = req.body;

        console.log(`Event: ${githubEvent} `);

        await processGithubWebhookEvents(githubEvent, payload);

        res.status(200).json({ message: "Webhook processed successfully" });
    } catch (error) {
        console.error("Webhook error: ", error);
        res.status(500).json({ error: "Failed to process webhook" });
    }
}

module.exports = { handleGithubWebhook };
