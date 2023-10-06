const express = require("express");
const route = express.Router();
const api = require('./api');
const auth = require('./auth')
const user = require('./user')



route.use('/api', api);
route.use('/auth', auth);
route.use('/user', user);


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
