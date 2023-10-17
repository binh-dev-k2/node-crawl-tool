const User = require("../models/User");
const bcrypt = require("bcryptjs");


const createUser = async (data) => {
    const { user_name, email, password } = data;

    const user = {
        user_name: user_name,
        email: email.toLowerCase(),
        password: await hashPassword(password),
        gender: 0,
        is_blocked: false,
        role: 0
    }

    try {
        return User(user).save();
    } catch (error) {
        console.error(error);
        return false;
    }
}

const updateUser = async (_id, data) => {
    const { user_name, gender, images, social, phone, description } = data;
    const filter = { _id: _id };
    const update = {
        user_name: user_name,
        gender: gender,
        images: images,
        social: social,
        phone: phone,
        description: description
    };

    try {
        return await User.findOneAndUpdate(filter, update);
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
        throw new Error('Invalid user')
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        throw new Error('Invalid login credentials')
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

const hashPassword = async (password) => {
    return await bcrypt.hash(password, 8);
}

const verifyData = (data) => {
    Object.keys(data).forEach(k => data[k] = typeof data[k] == 'string' ? data[k].trim() : data[k]);
    return data
}

const getRandomUser = async (data) => {
    try {
        const randomUser = await User.aggregate([
            {
                $match: { is_blocked: false, gender: data.gender },
            },
            {
                $sample: { size: 1 }
            }
        ]);

        return randomUser;
    } catch (error) {
        console.error(error);
        return false;
    }
}

module.exports = {
    createUser,
    getUser,
    updateToken,
    getUserById,
    findByCredentials,
    verifyUser,
    hashPassword,
    verifyData,
    getRandomUser
};
