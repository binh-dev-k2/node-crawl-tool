require('dotenv').config();
require('./src/config/database').connect();
const express = require('express');
const route = require('./src/routes/route');
const morgan = require("morgan");

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(route);

if (process.env.NODE_ENV == "development") {
    app.use(morgan("dev"));
}

module.exports = app;
