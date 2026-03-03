const express = require("express");
const { handleGithubWebhook } = require("./webhook.controller");
const { verifyGithubSignature } = require("./webhook.middleware");

const router = express.Router();

router.post("/github", verifyGithubSignature, handleGithubWebhook);

module.exports = router;
