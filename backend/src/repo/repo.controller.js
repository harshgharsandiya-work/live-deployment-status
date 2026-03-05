const prisma = require("../config/prisma");
const {
    createRepoWebhook,
    fetchUserRepos,
    fetchRepoById,
} = require("./github.service");

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
    const { githubRepoId } = req.body;
    const { userId } = req.user;

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user || !user.accessToken) {
            return res
                .status(404)
                .json({ error: "User or access token not found" });
        }

        const existingRepo = await prisma.repositories.findUnique({
            where: { githubRepoId },
        });

        if (existingRepo) {
            return res
                .status(400)
                .json({ error: `${existingRepo.name} is aldready registered` });
        }

        // fetch details from GitHub using user's token
        const repoData = await fetchRepoById(user.accessToken, githubRepoId);

        if (!repoData || !repoData.permissions?.admin) {
            return res.status(403).json({
                error: "You do not have admin access to this repository",
            });
        }

        const name = repoData.name;
        const fullname = repoData.full_name;
        const owner = repoData.owner.login;

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
