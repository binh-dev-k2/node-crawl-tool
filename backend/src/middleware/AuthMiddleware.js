const jwt = require("jsonwebtoken");
require("dotenv").config();

const VerifyToken = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '')

    if (!token) {
        return res.redirect('/login')
        // return res.status(403).send("A token is required for authentication");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const user = verifyUser(decoded._id, token)
        if (!user) {
            throw new Error()
        }
        req.user = user;
        next()
    } catch (err) {
        res.status(401).send({
            success: true,
            message: 'Not authorized to access this resource',
            data: {}
        })
    }
};

const CheckAdmin = (req, res, next) => {
    try {
        if (!req.user.role) {
            throw new Error()
        }
        next()
    } catch (err) {
        res.status(401).send({
            success: true,
            message: 'Not authorized to access this resource',
            data: {}
        })
    }
};

module.exports = { VerifyToken, CheckAdmin };