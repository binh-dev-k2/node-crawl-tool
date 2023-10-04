const { findUser, createUser, updateToken } = require("../services/userService");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try {
        const { user_name, email, password, images, social, phone } = req.body;
        // Validate user input
        if (!(user_name && email && password)) {
            res.status(400).send("All input is required");
        }

        const hasUser = await findUser(email);
        if (hasUser) {
            return res.status(409).json({
                success: false,
                message: "Email đã tồn tại."
            });
        }

        //Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);

        const userModel = {
            user_name: user_name,
            email: email.toLowerCase(),
            password: encryptedPassword,
            images: images,
            social: [],
            phone: phone,
            status: 0,
            is_blocked: false
        }

        const user = await createUser(userModel);

        // Create token
        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );

        user.token = token;

        res.status(201).json({
            success: true,
            message: 'Thêm mới tài khoản thành công!',
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra, xin vui lòng thử lại sau.',
            error: error.message,
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            res.status(400).send("All input is required");
        }
        
        const user = await findUser(email);

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );

            user.token = token;

            res.status(201).json({
                success: true,
                message: 'Đăng nhập thành công!',
                data: user
            });
        }
        res.status(400).send("Invalid Credentials");
    } catch (err) {
        console.log(err);
    }
};

module.exports = { register, login };
