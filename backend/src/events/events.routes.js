const express = require("express");
const { getPastEvents } = require("./events.controller");

const router = express.Router();

router.get("/", getPastEvents);

module.exports = router;
