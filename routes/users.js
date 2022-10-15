import express from "express";
export const router = express.Router();

router.get("/profile", (req, res, next) => {
  res.status(200).json({
    message: "You made it to the secured route",
    user: req.user,
    token: req.query.secret_token,
  });
});
