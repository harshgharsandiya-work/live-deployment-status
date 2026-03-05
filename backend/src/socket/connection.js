const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

function registerConnection(io) {
    // Middleware for authentication
    io.use((socket, next) => {
        const token =
            socket.handshake.auth?.token ||
            socket.handshake.headers?.authorization?.split(" ")[1];
        if (!token) {
            return next(new Error("Authentication error: Token missing"));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded; // { userId, username }
            next();
        } catch (err) {
            return next(new Error("Authentication error: Invalid token"));
        }
    });

    io.on("connection", (socket) => {
        console.log(
            `Client connected: ${socket.id}, User: ${socket.user.username}`,
        );

        socket.on("join-room", async (room) => {
            if (room.startsWith("repo_")) {
                const repositoryId = room.split("repo_")[1];

                try {
                    const repo = await prisma.repositories.findFirst({
                        where: {
                            id: repositoryId,
                            userId: socket.user.userId,
                        },
                    });

                    if (repo) {
                        socket.join(room);
                        console.log(
                            `User ${socket.user.username} joined room ${room}`,
                        );
                    } else {
                        console.log(
                            `User ${socket.user.username} unauthorized for room ${room}`,
                        );
                        socket.emit("error", {
                            message: "Unauthorized to join this room",
                        });
                    }
                } catch (error) {
                    console.error("Socket join room error:", error);
                }
            } else {
                socket.join(room);
            }
        });

        socket.on("disconnect", () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}

module.exports = { registerConnection };
