require("dotenv").config();
require("./src/config/database").connect(); // connect mongoose
const express = require("express");
const route = require("./src/routes/route");
const morgan = require("morgan");
const session = require("express-session"); // session middleware
const passport = require("passport"); // authentication
const cors = require("cors");

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());  // to allow cross origin requests

// Configure Sessions Middleware
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 60 * 60 * 1000 },
    })
);

// Configure More Middleware
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

app.use(route);

if (process.env.NODE_ENV == "development") {
    app.use(morgan("dev"));
    session.Cookie.secure = true;
}

module.exports = app;
