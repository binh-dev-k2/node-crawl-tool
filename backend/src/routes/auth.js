const express = require("express");
const { register, login } = require("../controllers/AuthController");
const route = express.Router();

// route.get('/register', register)
// route.get('/login', login)

module.exports = route;
