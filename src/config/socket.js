const { Server } = require("socket.io");


//Socket connection
exports.connectSocket = (server) => {
    const io = new Server(server);
    io.on('connection', (socket) => {
        console.log('a user connected');
    });
}