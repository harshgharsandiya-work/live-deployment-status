const prisma = require("../config/prisma");
const { createRepoWebhook, fetchUserRepos } = require("./github.service");

// fetch user repos
async function getRepositories(req, res) {
    const { userId } = req.user;

    try {
        //get access token of user
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user || !user.accessToken) {
            return res
                .status(404)
                .json({ error: "User or Github Access Token not found" });
        }

        const repos = await fetchUserRepos(user.accessToken);

        //formatted repo
        const formattedRepo = repos.map((repo) => ({
            githubRepoId: repo.id.toString(),
            name: repo.name,
            fullname: repo.full_name,
            owner: repo.owner.login,
        }));

        res.status(200).json(formattedRepo);
    } catch (error) {
        console.error(
            "Error fetching repos: ",
            error.response?.data || error.message,
        );

        res.status(500).json({ error: "Failed to fetch repositories" });
    }
}

//register repo & create webhook
async function registerRepository(req, res) {
    const { githubRepoId, name, fullname, owner } = req.body;
    const { userId } = req.user;

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        const existingRepo = await prisma.repositories.findUnique({
            where: { githubRepoId },
        });

        if (existingRepo) {
            return res
                .status(400)
                .json({ error: `${existingRepo.name} is aldready registered` });
        }

        //config for webhook
        const webhookUrl = `${process.env.BASE_URL}/api/webhook/github`;
        const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;

        //auto-create webhook via Github REST API
        await createRepoWebhook(
            user.accessToken,
            owner,
            name,
            webhookUrl,
            webhookSecret,
        );

        //save repo to db
        const savedRepo = await prisma.repositories.create({
            data: {
                githubRepoId: githubRepoId.toString(),
                name,
                fullname,
                owner,
                userId,
            },
        });

        res.status(201).json({
            message: `${name} registered successfully & Webhook created`,
            repo: savedRepo,
        });
    } catch (error) {
        console.error(
            "Error registering repo: ",
            error.response?.data || error.message,
        );

        res.status(500).json({ error: "Failed to register repository" });
    }
}

module.exports = { getRepositories, registerRepository };
