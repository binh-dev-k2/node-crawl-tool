const { getRandomUser, verifyData, getUserById } = require("../services/UserService")
const { updateUserService , getImgUrl,handle,getLoveUser } =  require("../services/UserService");



const randomUser = async (req, res) => {
    let user = req.user;
    let listUser = await getRandomUser(user);
    if (!listUser.length) {
        return res.status(200).json({
            success: true,
            message: "Không tìm thấy ai phù hợp với bạn =)).",
            data: []
        });
    }
    

    res.status(200).json({
        success: true,
        message: 'Thành công!',
        data: {
            users: listUser
        },
    });
}
const updateUser = async (req,res) => {
    try {
        const data = verifyData(req.body);
        const id = req.user._id
        let urlImages =getImgUrl(req.files);
        data.images = urlImages;
        data.listAccepted = [];
        data.listIgnore = [];
        updateUserService(id, data);
        res.status(200).json("done")
} catch (error) {
        res.status(error.code).json("error", error.message);
}
}
const getMyUser = async (req, res) => {
    const url = req.protocol + '://' + req.get('host');
    let user = req.user;
    let images = [];
    for (let index = 0; index < user.images.length; index++) {
        const element = user.images[index];
        images.push(url+element);
    }
    user.images = images;
    return res.status(200).json(user);
};
const handleUser = async (req,res) => {
    try {
        let data = verifyData(req);
        let user = data.user;
        let listLoveUser = await handle(user.id, data.body)
        res.status(200).json({
            success: true,
            message: 'Thành công!',
            data: {
                users: listLoveUser
            },
        });
    } catch (error) {
        res.status(error.code).json("error", error.message);
    }
}
const loveUser = async (req,res) => {
    try {
        let data = verifyData(req);
        let user = data.user;
        let listUserNews = await getLoveUser(user.id)
        res.status(200).json({
            success: true,
            message: 'Thành công!',
            data: {
                users: listUserNews
            },
        });
    } catch (error) {
        console.log(error);
        // res.status(400).json("error", error);
    }
}

module.exports = { randomUser,updateUser,getMyUser,handleUser,loveUser };