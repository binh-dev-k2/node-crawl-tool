const express = require('express');
const route = require('./src/routes/route');
const mongoose = require('mongoose');
const config = require('./src/config/config')
const morgan = require("morgan");
const mysql = require('mysql');

const mongoConfig = config.mongodb
const mongodb = `mongodb://${mongoConfig.host}:${mongoConfig.port}/${mongoConfig.name}`;

mongoose.connect(mongodb, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected!!!'))
    .catch((err) => console.log(err));

// const mysqlConfig = config.mysql
// const con = mysql.createConnection({
//     host: mysqlConfig.host,
//     user: mysqlConfig.user,
//     password: mysqlConfig.password,
//     database: mysqlConfig.database
// });

// con.connect(function (err) {
//     if (err) throw err;
//     console.log("MySQL connected!!!");
// });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (config.process == "development") {
    app.use(morgan("dev"));
}

app.use("/api/crawl", route);

module.exports = app
