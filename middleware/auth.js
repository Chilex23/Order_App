import passport from "passport";
import strategy from "passport-local";
import jsonStrategy from "passport-jwt";
import User from "../models/users.js";
import { checkUsername } from "../services/users.js";
import { signUpValidator, loginValidator } from "../validators/users.js";

const localStrategy = strategy.Strategy;
const JWTstrategy = jsonStrategy.Strategy;
const ExtractJWT = jsonStrategy.ExtractJwt;

passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      try {
        const validateResult = signUpValidator(req.body);
        if (validateResult.error) {
          return done(null, false, { message: validateResult.error.message });
        }

        if (!(await checkUsername(req.body.username)))
          return done(null, false, { message: "Username already exists" });
        const user = await User.create(req.body);
        return done(null, user);
      } catch (e) {
        console.log("Throw async bad request");
        return done(e);
      }
    }
  )
);

passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      const body = { username, password };
      try {
        const validateResult = loginValidator(body);
        if (validateResult.error) {
          return done(null, false, { message: validateResult.error.message });
        }
        const user = await User.findOne({ username });
        if (!user) {
          return done(null, false, {
            message: "User not found, check the username provided.",
          });
        }

        const validate = await user.validatePassword(password);

        if (!validate) {
          return done(null, false, { message: "Wrong password" });
        }

        return done(null, user, { message: "Logged in successfully" });
      } catch (error) {
        console.log("error login middleware", error);
        return done(error);
      }
    }
  )
);

passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (e) {
        return done(e);
      }
    }
  )
);

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(401).json({
        message: "You do not have the permission to carry out this request.",
        success: false,
      });
    }
    next();
  };
};
