const User = require("../models/User");

const createUser = async (user) => {
    try {
        return User(user).save();
    } catch (error) {
        console.error(error);
        return false;
    }
}

const updateToken = async (user, token) => {
    const filter = { email: user.email };
    const update = { token: token };

    try {
        return await User.findOneAndUpdate(filter, update);
    } catch (error) {
        console.error(error);
        return false;
    }
}


const findUser = async (email) => {
    try {
        return await User.findOne({ email: email }).exec();
    } catch (error) {
        console.error(error);
        return false;
    }
}

module.exports = { createUser, findUser, updateToken };
