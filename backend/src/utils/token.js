const { updateToken } = require("../services/UserService");
require("dotenv").config();

const getToken = (headers) => {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};

const generateAuthToken = async (user) => {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY)
    user.token = token
    await updateToken(user, token)
    return token
}

exports.default = { getToken, generateAuthToken }