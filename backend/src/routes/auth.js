const express = require("express");
const { register, login, logout } = require("../controllers/AuthController");
const route = express.Router();
const passport = require("passport");
require('../config/passpost')(passport)

// route.get('/register', register)
// route.get('/login', login)
// route.get('/logout', passport.authenticate('jwt', { session: false }), logout);
route.get('/logout', passport.authenticate('jwt', { session: false }), logout);

module.exports = route;
