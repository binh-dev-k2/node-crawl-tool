require("dotenv").config();
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const { getUser, getUserById } = require("../services/UserService");

module.exports = (passport) => {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt')
    opts.secretOrKey = process.env.JWT_KEY;
    passport.use(
        new JwtStrategy(opts, async (jwt_payload, done) => {
            try {
                const user = await getUserById(jwt_payload.id);
                if (user) {
                    done(null, user);
                }
                done(null, false);
            } catch (error) {
                done(error, false);
            }
        })
    );
};
