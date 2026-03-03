const { Server } = require("socket.io");
const { registerConnection } = require("./connection");

function initSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: "*",
        },
    });

    registerConnection(io);
}

module.exports = initSocket;
