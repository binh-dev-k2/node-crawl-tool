const path = require('path');
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const GridFSBucket = require('mongodb').GridFSBucket;
const { MongoClient, ObjectId } = require('mongodb');
const { default: mongoose } = require("mongoose");


const createUser = async (data) => {
    const { user_name, email, password } = data;

    const user = {
        user_name: user_name,
        email: email.toLowerCase(),
        password: await hashPassword(password),
        gender: 0,
        is_blocked: false,
        role: 0,
    };

    try {
        return User(user).save();
    } catch (error) {
        console.error(error);
        return false;
    }
};

const updateUser = async (_id, data) => {
    
    const { user_name, gender, images, social, phone, description,birth,hobbies, listAccepted,listIgnore } = data;
    const filter = { _id: _id };

    const update = {
        user_name: user_name,
        gender: gender,
        images: images,
        social: social,
        phone: phone,
        description: description,
        listIgnore: listIgnore,
        listAccepted: listAccepted,
        birth: birth,
        hobbies: hobbies,
    };

    try {
        return await User.findOneAndUpdate(filter, update);
    } catch (error) {
        console.error(error);
        return false;
    }
};

const updateToken = async (user, token) => {
    const filter = { email: user.email };
    const update = { token: token };

    try {
        return await User.findOneAndUpdate(filter, update);
    } catch (error) {
        console.error(error);
        return false;
    }
};

const getUser = async (email) => {
    try {
        return await User.findOne({ email: email }).exec();
    } catch (error) {
        console.error(error);
        return false;
    }
};

const getUserById = async (id) => {
    try {
        return await User.findOne({ _id: id }).exec();
    } catch (error) {
        console.error(error);
        return false;
    }
};

const findByCredentials = async (email, password) => {
    const user = await getUser(email);

    if (!user) {
        throw new Error("Invalid user");
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new Error("Invalid login credentials");
    }
    return user;
};

const verifyUser = async (_id, token) => {
    try {
        return await User.findOne({ _id: _id, token: token }).exec();
    } catch (error) {
        console.error(error);
        return false;
    }
};

const hashPassword = async (password) => {
    return await bcrypt.hash(password, 8);
};

const verifyData = (data) => {
    Object.keys(data).forEach(
        (k) => (data[k] = typeof data[k] == "string" ? data[k].trim() : data[k])
    );
    return data;
};

const getRandomUser = async (user) => {
    try {
        let gender = user.gender == 1 ? 2: 1 ;
        console.log("gender: " + gender);
        let listUsers = await getUsersByGender(gender);
        let listUserAvailable = [];
        let myAge = Math.floor((Date.now() - user.birth)/ (1000 * 60 * 60 * 24 * 365));
        let myHobbie = user.hobbies.map(e => e.id);
        console.log("my hoobie: ",myHobbie);
        console.log("my age: ", myAge);
        for (let index = 0; index < listUsers.length; index++) {
            const element = listUsers[index];
            if(user.listAccepted.find(accept => accept == element.id) || user.listIgnore.find(ignore => ignore == element.id)) {
                continue;
            }
            let score = 0;
            let age = Math.floor((Date.now() - element.birth)/ (1000 * 60 * 60 * 24 * 365));
            let ageGap = (10 - Math.abs(myAge - age))
            score += ageGap < 0 ? 0 : ageGap;
            element.hobbies.forEach(hoobie => {
                score += myHobbie.reduce((total,h) => {
                    if(h == hoobie.id) {
                       return total + 5
                    }
                    return total;
                },0)
            });
           let newUser = {
            user_name:element.user_name,
            gender:element.gender,
            age:age,
            description:element.description,
            phone: element.phone,
            score: score,
            hobbies: element.hobbies,
            images: element.images,
            social: element.social,
            id: element._id,
           }
           
            listUserAvailable.push(newUser);
            if(listUserAvailable.length > 3) {
                break;
            }
        }
        return listUserAvailable.sort((a,b) =>   b.score -a.score);
    } catch (error) {
        console.error(error);
        return false;
    }
};

const getImgUrl = (FilePath) => {
    let url = [];
    for (let index = 0; index < FilePath.length; index++) {
        const element = FilePath[index];
        const fileName = path.basename(element.path);
        const relativeUrl = '/public/images/'  + fileName;
        url.push(relativeUrl);
    }
    return url;
}   
const getUsersByGender = async (gender) => {
    try {
        return await User.find({ gender: gender }).exec();
    } catch (error) {
        console.error(error);
        return false;
    }
}
const handle =async (userID, data) => {
    let user = await getUserById(userID);
    let updateData = {};
    if(data.status) {
        updateData["listAccepted"] = user.listAccepted.concat([data.id]);
    }else {
        updateData["listIgnore"] = user.listIgnore.concat([data.id]);

    }
    await updateUser(userID, updateData);
    let listUserNews = await getRandomUser(user);
    if(listUserNews[0].id == data.id) {
        listUserNews.shift();
    }
    return listUserNews;
}
async function getLoveUser(userID) {
    let user = await getUserById(userID);
    const loveUserIDs = user.listAccepted;
    // console.log(loveUserIDs);
    let listLoveUser = [];
    for (let index = 0; index < loveUserIDs.length; index++) {
        const element = loveUserIDs[index];
        let loveUser = await getUserById(element);
        
        if(loveUser.listAccepted.find(user => user == userID)) {
            listLoveUser.push({
                id: loveUser.id,
                user_name: loveUser.user_name,
                images: loveUser.images,
                phone: loveUser.phone,
                social: loveUser.social,
                birth: loveUser.birth,
                description: loveUser.description,
                hobbies: loveUser.hobbies,
                gender: loveUser.gender
            })
        }
    }
    console.log(listLoveUser);
    return listLoveUser
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
    getRandomUser,
    updateUserService: updateUser,
    getImgUrl,
    handle,
    getLoveUser
};
