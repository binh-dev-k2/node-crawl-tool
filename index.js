const http = require("http");
const app = require("./app");
const server = http.createServer(app);
require('./src/config/socket').connectSocket(server);

const port = process.env.PORT || 3333

server.listen(port, () => {
    console.log(`Server is running on port ${port} 📍 🎆`);
});