const { updateToken } = require("../services/UserService");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateAuthToken = async (user) => {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY)
    await updateToken(user, token)
    return token
}

module.exports = { generateAuthToken }