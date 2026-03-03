const { getIO } = require("./index");

function emitToAll(event, data) {
    const io = getIO();
    io.emit(event, data);
}

function emitToRoom(room, event, data) {
    const io = getIO();
    io.to(room).emit(event, data);
}

module.exports = { emitToAll, emitToRoom };
