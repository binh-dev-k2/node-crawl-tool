require("dotenv").config();
require("./src/config/database").connect(); // connect mongoose
const express = require("express");
const route = require("./src/routes/route");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());  // to allow cross origin requests


app.use(route);

if (process.env.NODE_ENV == "development") {
    app.use(morgan("dev"));
    session.Cookie.secure = true;
}

module.exports = app;
