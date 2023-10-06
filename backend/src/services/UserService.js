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

const getUser = async (email) => {
    try {
        return await User.findOne({ email: email }).exec();
    } catch (error) {
        console.error(error);
        return false;
    }
}

const getUserById = async (id) => {
    try {
        return await User.findOne({ id: id }).exec();
    } catch (error) {
        console.error(error);
        return false;
    }
}

const findByCredentials = async (email, password) => {
    const user = await getUser(email);
    if (!user) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    return user
}

const verifyUser = async (_id, token) => {
    try {
        return await User.findOne({ _id: _id, token: token }).exec();
    } catch (error) {
        console.error(error);
        return false;
    }
}

module.exports = { createUser, getUser, updateToken, getUserById, findByCredentials, verifyUser };
