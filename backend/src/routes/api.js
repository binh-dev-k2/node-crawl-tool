const express = require("express");
const route = express.Router();
const { register, login } = require("../controllers/AuthController");
const { validateRegister, validateLogin } = require("../utils/validate")


route.post('/auth/register', register)
route.post('/auth/login', login)

module.exports = route;
