import { signToken } from "../helpers/auth.js";
import passport from "passport";

export const loginController = async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      const { message } = info;
      if (err || !user) {
        return res.status(401).json({ message, success: false });
      }
      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);
        const body = {
          _id: user._id,
          username: user.username,
          role: user.role,
        };
        const token = signToken({ user: body });
        return res
          .status(200)
          .json({ token, success: true, message: "Login successfull" });
      });
    } catch (e) {
      console.log("error", e);
      return next(e);
    }
  })(req, res, next);
};

export const signUpController = async (req, res, next) => {
  passport.authenticate("signup", async (err, user, info) => {
    try {
      // console.log("signup route err", err, "signup route info", info);
      if (info) {
        const { message } = info;
        return res.status(401).json({ message, success: false });
      }

      if (err) {
        console.log(err.message);
        const { message } = err;
        return res.status(400).json({ message, success: false });
      }
      // console.log(user);
      return res
        .status(201)
        .json({
          message: "Signup successful, redirect to login page.",
          user: user.username,
          success: true,
        });
    } catch (e) {
      next(e);
    }
  })(req, res, next);
};
