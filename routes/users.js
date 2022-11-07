import express from "express";
import passport from "passport";
import { getToken } from "../helpers/auth.js";
import {
  changeUserPassword,
  checkAvailableUsername,
  updateUserProfile,
} from "../controllers/users.js";
export const router = express.Router();

router.use(passport.authenticate("jwt", { session: false }));
router.get("/profile", (req, res, next) => {
  const token = getToken(req);
  // console.log(token);

  res.status(200).json({
    message: "You made it to the secured route",
    user: req.user,
    token: token,
  });
});

router.post("/update-password", changeUserPassword);
router.post("/check-username", checkAvailableUsername);
router.post("/update-profile", updateUserProfile);
