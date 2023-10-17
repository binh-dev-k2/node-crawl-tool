require("dotenv").config();
require("./src/config/database").connect(); // connect mongoose
const express = require("express");
const route = require("./src/routes/route");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // to allow cross origin requests

const apiCallRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: "You have reached maximum retries. Please try again later",
    statusCode: 429,
    headers: true,
    keyGenerator(req) {
        console.log(req.ip);
        return req.clientIp;
    },
});

app.set("trust proxy", true);
app.use(apiCallRateLimiter);
app.use(route);

if (process.env.NODE_ENV == "development") {
    app.use(morgan("dev"));
}

module.exports = app;
