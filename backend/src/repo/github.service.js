const axios = require("axios");

//fetch repo which user has access too
async function fetchUserRepos(accessToken) {
    const response = await axios.get("https://api.github.com/user/repos", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.github.v3+json",
        },
        params: {
            visibility: "all",
            sort: "updated",
            per_page: 100,
        },
    });

    return response.data;
}

//auto create Webhook on Github
async function createRepoWebhook(accessToken, owner, repo, webhookUrl, secret) {
    const response = await axios.post(
        `https://api.github.com/repos/${owner}/${repo}/hooks`,
        {
            name: "web",
            active: true,
            events: ["push", "pull_request", "workflow_run"],
            config: {
                url: webhookUrl,
                content_type: "json",
                secret: secret,
                insecure_ssl: "0",
            },
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/vnd.github.v3+json",
            },
        },
    );

    return response.data;
}

module.exports = { fetchUserRepos, createRepoWebhook };
