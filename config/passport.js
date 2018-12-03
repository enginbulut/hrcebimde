const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const keys = require("../config/keys");

//Load User model and user domain
const UserModel = require("../models/UserModel");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const user = await UserModel.getUserByEmail(jwt_payload.email);
        if (user) return done(null, user);
        else return done(null, false);
      } catch (ex) {
        console.log(err);
      }
    })
  );
};
