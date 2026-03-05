const express = require("express");
const cors = require("cors");

//routes import
const webhookRoutes = require("./webhook/webhook.routes");
const eventsRoutes = require("./events/events.routes");
const authRoutes = require("./auth/auth.routes");

const app = express();

//middleware
app.use(cors());
app.use(
    express.json({
        verify: (req, res, buf) => {
            req.rawBody = buf;
        },
    }),
);

//route to check server running
app.get("/", async (req, res) => {
    res.status(200).json({ message: "Server is running" });
});

//routes
app.use("/api/webhook", webhookRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;
