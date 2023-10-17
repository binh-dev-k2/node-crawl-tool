const { getRandomUser, verifyData } = require("../services/UserService")



const randomUser = async (req, res) => {
    const data = verifyData(req.body);

    const user = await getRandomUser(data);
    if (!user.length) {
        return res.status(400).json({
            success: true,
            message: "Không tìm thấy ai phù hợp với bạn =)).",
            data: { }
        });
    }

    res.status(200).json({
        success: true,
        message: 'Thành công!',
        data: {
            user: {
                email: user[0].email,
                user_name: user[0].user_name,
                phone: user[0].phone,
                gender: user[0].gender,
                images: user[0].images,
                social: user[0].social,
                description: user[0].description
            }
        },
    });
}

module.exports = { randomUser };