const { updateToken } = require("../services/UserService");
require("dotenv").config();

const generateAuthToken = async (user) => {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY)
    user.token = token
    await updateToken(user, token)
    return token
}

exports.default = { generateAuthToken }