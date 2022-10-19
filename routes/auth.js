import express from "express";
import { loginController, signUpController } from "../controllers/auth.js";

export const router = express.Router();

router.post("/signup", signUpController);
router.post("/login", loginController);
router.get("/logout", function (req, res, next) {
  try {
    console.log(`/logout`);
    console.log(req);
    res.status(200).json({ message: "Log out successfull." });
  } catch (e) {
    console.error(`/logout ERROR ${e.stack}`);
    next(e);
  }
});
