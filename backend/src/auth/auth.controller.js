const axios = require("axios");
const prisma = require("../config/prisma");
const jwt = require("jsonwebtoken");

//redirect user to github url
async function githubLogin(req, res) {
    const githubClientId = process.env.GITHUB_CLIENT_ID;
    const redirectUri =
        process.env.BASE_URL + process.env.GITHUB_CALLBACK_ENDPOINT;

    const authUrl =
        `https://github.com/login/oauth/authorize` +
        `?client_id=${githubClientId}` +
        `&redirect_uri=${redirectUri}` +
        `&scope=user:email,repo,admin:repo_hook`;

    res.redirect(authUrl);
}

//github callback
async function githubCallback(req, res) {
    const code = req.query.code;

    if (!code) {
        return res.status(400).json({ error: "Authorization code missing" });
    }

    try {
        const tokenResponse = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code: code,
            },
            {
                headers: {
                    Accept: "application/json",
                },
            },
        );

        const accessToken = tokenResponse.data.access_token;

        if (!accessToken) {
            return res
                .status(400)
                .json({ error: "Failed to retrieve access token" });
        }

        // Use the token to fetch the user's profile
        const userResponse = await axios.get("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        // Use the token to fetch the user's emails
        const emailResponse = await axios.get(
            "https://api.github.com/user/emails",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );

        const primaryEmail = emailResponse.data.find((e) => e.primary)?.email;

        const githubUser = userResponse.data;

        //save to your database
        const user = await prisma.user.upsert({
            where: {
                githubId: githubUser.id.toString(),
            },
            update: {
                accessToken,
                username: githubUser.login,
                email: primaryEmail,
                avatarUrl: githubUser.avatar_url,
            },
            create: {
                githubId: githubUser.id.toString(),
                accessToken,
                username: githubUser.login,
                email: primaryEmail,
                avatarUrl: githubUser.avatar_url,
            },
        });

        const jwt_token = jwt.sign(
            {
                userId: user.id,
                username: user.username,
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" },
        );

        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
        res.redirect(`${frontendUrl}/auth/success?token=${jwt_token}`);
    } catch (error) {
        console.error(
            "GitHub OAuth Callback Error:",
            error.response?.data || error.message,
        );
        res.status(500).json({ error: "Authentication failed" });
    }
}

// get github app configuration for installation link
function getGithubAppName(req, res) {
    const appName = process.env.GITHUB_APP_NAME || "integration-1";
    res.json({ appName });
}

module.exports = { githubCallback, githubLogin, getGithubAppName };
