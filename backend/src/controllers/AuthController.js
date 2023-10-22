const { getUser, createUser, findByCredentials, verifyData } = require("../services/UserService");
const { generateAuthToken } = require("../utils/token")
require("dotenv").config();

const register = async (req, res) => {
    try {
        const data = verifyData(req.body);

        const existingUser = await getUser(data.email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email đã tồn tại.",
                data: { user: data }
            });
        }

        const user = await createUser(data);
        if (!user) {
            return res.status(500).json({
                success: false,
                message: 'Có lỗi xảy ra trong quá trình đăng ký, xin vui lòng thử lại sau.',
                data: { error: error.message },
            });
        }

        const token = await generateAuthToken(user)
        user.token = token

        res.status(200).json({
            success: true,
            message: 'Thêm mới tài khoản thành công!',
            data: {
                user: {
                    user_name: user.user_name,
                    _token: token
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra, xin vui lòng thử lại sau.',
            data: { error: error.message },
        });
    }
    res.end();
};

const login = async (req, res) => {
    try {
        const data = verifyData(req.body);
        const { email, password } = data;

        const user = await findByCredentials(email, password);
        if (!user || user.is_blocked == 1) {
            return res.status(401).send({
                success: true,
                message: 'Login failed! Check authentication credentials',
                data: {}
            })
        }

        const token = await generateAuthToken(user)
        user.token = token

        res.status(200).json({
            success: true,
            message: 'Đăng nhập thành công!',
            data: {
                user: user.user_name,
                images: user.images,
                gender: user.gender,
                is_blocked: user.is_blocked,
                _token: token
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Có lỗi xảy ra, xin vui lòng thử lại sau.',
            data: { error: error.message },
        });
    }
    res.end();
};


module.exports = { register, login };
