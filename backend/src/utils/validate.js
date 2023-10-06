const { check, validationResult } = require("express-validator");

const validateRegister = [
    check("user_name")
        .trim()
        .escape()
        .not()
        .notEmpty()
        .withMessage("User name can not be empty!")
        .bail()
        .isLength({ min: 6 })
        .withMessage("Minimum 3 characters required!")
        .bail(),
    check("email")
        .trim()
        .isEmail()
        .not()
        .notEmpty()
        .withMessage("Invalid email address!")
        .bail(),
    check("password")
        .trim()
        .not()
        .notEmpty()
        .bail()
        .isLength({ min: 6 })
        .withMessage("Minimum 6 characters required!"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.notEmpty())
            return res.status(422).json({ errors: errors.array() });
        next();
    },
];

const validateLogin = [
    check("email")
        .trim()
        .normalizeEmail()
        .not()
        .notEmpty()
        .withMessage("Invalid email address!")
        .bail(),
    check("password")
        .trim()
        .not()
        .notEmpty()
        .withMessage("Password can not be empty!")
        .bail()
        .isLength({ min: 6 })
        .withMessage("Minimum 6 characters required!"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.notEmpty())
            return res.status(422).json({ errors: errors.array() });
        next();
    },
];

exports.default = { validateRegister, validateLogin };
