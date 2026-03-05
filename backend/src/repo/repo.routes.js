const express = require("express");
const { authenticateUser } = require("../auth/auth.middleware");
const {
    getRepositories,
    registerRepository,
    getGithubRepositories,
} = require("./repo.controller");

const router = express.Router();

router.use(authenticateUser);

router.get("/", getRepositories);
router.get("/github", getGithubRepositories);
router.post("/", registerRepository);

module.exports = router;
