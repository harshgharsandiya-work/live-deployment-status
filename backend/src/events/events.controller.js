const prisma = require("../config/prisma");

async function getPastEvents(req, res) {
    try {
        //limit to past 30 events
        const events = await prisma.event.findMany({
            orderBy: {
                updatedAt: "desc",
            },
            take: 30,
        });
        res.status(200).json(events);
    } catch (error) {
        console.error("Error fetching past events: ", error);
        res.status(500).json({ error: "Failed to fetch past events" });
    }
}

module.exports = { getPastEvents };
