const express = require("express");
const {
    githubLogin,
    githubCallback,
    getGithubAppName,
} = require("./auth.controller");

const router = express.Router();

router.get("/github", githubLogin);

router.get("/github/callback", githubCallback);

router.get("/github/app-name", getGithubAppName);

module.exports = router;
