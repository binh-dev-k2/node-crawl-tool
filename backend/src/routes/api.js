const express = require("express");
const route = express.Router();
const { register, login } = require("../controllers/AuthController");
const { validateRegister, validateLogin } = require("../utils/validate");
const { VerifyToken } = require("../middleware/AuthMiddleware");
const { randomUser } = require("../controllers/UserController");


route.post('/auth/register', register)
route.post('/auth/login', login)


route.post('/user/random-user', VerifyToken, randomUser)


module.exports = route;
