const http = require("http");
const app = require("./app");
const server = http.createServer(app);
require('./src/config/socket').connectSocket(server);

const PORT = process.env.PORT || 3333

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} 📍 🎆`);
});