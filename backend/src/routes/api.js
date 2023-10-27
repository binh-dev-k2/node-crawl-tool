const express = require("express");
const route = express.Router();
const { register, login } = require("../controllers/AuthController");
const { validateRegister, validateLogin } = require("../utils/validate");
const { VerifyToken } = require("../middleware/AuthMiddleware");
const { randomUser, updateUser,getMyUser, handleUser,loveUser } = require("../controllers/UserController");
const {uploadFile} = require("../utils/storage");



route.post('/auth/register', register)
route.post('/auth/login', login)


route.post('/user/random-user', VerifyToken, randomUser)
route.post('/user/update',[VerifyToken, uploadFile.any('images')] ,updateUser);
route.post('/user/myuser',[VerifyToken] ,getMyUser);
route.post('/user/handle',[VerifyToken] ,handleUser);
route.post('/user/love',[VerifyToken] ,loveUser);


module.exports = route;
