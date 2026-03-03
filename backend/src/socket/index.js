const { Server } = require("socket.io");
const { registerConnection } = require("./connection");

let io;

function initSocket(server) {
    io = new Server(server, {
        cors: {
            origin: "*",
        },
    });

    registerConnection(io);
}

function getIO() {
    if (!io) throw new Error("Socket not initialized");
    return io;
}

module.exports = { initSocket, getIO };
