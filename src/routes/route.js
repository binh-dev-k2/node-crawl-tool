const express = require("express");
const { register, login } = require("../controller/authController");
const auth = require("../middleware/auth");
const route = express.Router();



// route.post('/register', auth, register)  // Middleware check login
route.post('/register', register)
route.post('/login', login)

// This should be the last route else any after it won't work
route.use("*", (req, res) => {
    res.status(404).json({
        success: "false",
        message: "Page not found",
        error: {
            statusCode: 404,
            message: "You reached a route that is not defined on this server",
        },
    });
});


module.exports = route;
