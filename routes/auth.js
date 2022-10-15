import express from "express";
import passport from "passport";
import { signToken } from "../helpers/auth.js";
import { signUpController } from "../controllers/auth.js";

export const router = express.Router();

router.post(
  "/signup",
  passport.authenticate("signup", { session: false }),
  async (req, res, next) => {
    return res.status(201).json({ message: "Signup successful", user: req.user });
  }
);

router.post("/login", async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        const error = new Error("An error occurred");
        return next(error);
      }
      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);
        const body = { _id: user._id, username: user.username };
        const token = signToken({ user: body });
        return res.status(200).json({ token });
      });
    } catch (e) {
      console.log("error", e)
      return next(e);
    }
  })(req, res, next);
});