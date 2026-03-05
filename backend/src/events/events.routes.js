const express = require("express");
const { getPastEvents } = require("./events.controller");
const { authenticateUser } = require("../auth/auth.middleware");

const router = express.Router();

router.use(authenticateUser);

router.get("/", getPastEvents);

module.exports = router;
