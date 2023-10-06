const { getUser, createUser } = require("../services/UserService");
const { generateAuthToken } = require("../utils/token")
require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try {
        const { user_name, email, password, images, social, phone } = req.body;

        const existingUser = await getUser(email);
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email đã tồn tại.",
                data: []
            });
        }

        const userModel = {
            user_name: user_name.trim(),
            email: email.toLowerCase().trim(),
            password: await bcrypt.hash(password.trim(), 10),
            images: images,
            social: social.length > 0 ? social : [],
            phone: phone,
            status: 0,
            is_blocked: false,
            role: 0
        }

        const user = await createUser(userModel);

        res.status(201).json({
            success: true,
            message: 'Thêm mới tài khoản thành công!',
            data: { user: user }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra, xin vui lòng thử lại sau.',
            data: { error: error.message },
        });
    }
    res.end();
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await findByCredentials(email, password);
        if (!user) {
            return res.status(401).send({
                success: true,
                message: 'Login failed! Check authentication credentials',
                data: {}
            })
        }

        const token = await generateAuthToken(user)

        return res.status(200).json({
            success: true,
            message: 'Đăng nhập thành công!',
            data: { token: 'Bearer ' + token },
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
};

const logout = async (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        return res.redirect('/login');
    });
}


module.exports = { register, login, logout };
