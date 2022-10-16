import express from "express";
import { getToken } from "../helpers/auth.js";
import { changeUserPassword, checkAvailableUsername, updateUserProfile } from "../controllers/users.js";
export const router = express.Router();

router.get("/profile", (req, res, next) => {
  const token = getToken(req);
  console.log(token);

  res.status(200).json({
    message: "You made it to the secured route",
    user: req.user,
    token: token,
  });
});

router.post("/update_password", changeUserPassword);
router.post("/check_username", checkAvailableUsername);
router.post("/update_profile", updateUserProfile);
