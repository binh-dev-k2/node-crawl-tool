const express = require("express");
const { register, login, logout } = require("../controllers/AuthController");
const route = express.Router();

// route.get('/register', register)
// route.get('/login', login)
// route.get('/logout', logout);
route.get('/logout', logout);

module.exports = route;
