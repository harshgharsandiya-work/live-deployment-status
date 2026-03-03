const express = require("express");
const { handleGithubWebhook } = require("./webhook.controller");

const router = express.Router();

router.post("/github", handleGithubWebhook);

module.exports = router;
