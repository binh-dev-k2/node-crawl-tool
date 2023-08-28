const express = require('express');
const route = require('./src/routes/route');
const mongoose = require('mongoose');
const morgan = require("morgan");
const config = require('./src/config/config');


const mongodb = `mongodb://${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.name}`;

mongoose.connect(mongodb, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected!!!'))
    .catch((err) => console.log(err));

// const con = mysql.createConnection({
//     host: mysql.host,
//     user: mysql.user,
//     password: mysql.password,
//     database: mysql.name
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

app.use("/api", route);

module.exports = app
