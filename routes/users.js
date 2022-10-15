import express from "express";
import { getToken } from "../helpers/auth.js";
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
