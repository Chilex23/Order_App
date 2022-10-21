import express from "express";
import passport from "passport";
import { restrictTo } from "../middleware/auth.js";
import {
  addFoodController,
  updateFoodController,
  getAllFoodController,
  deleteFoodController,
  addReviewController,
  updateReviewController,
  getReviewsContoller
} from "../controllers/food.js";

export let router = express.Router();

router.use(passport.authenticate("jwt", { session: false }));
router.get("/", restrictTo("Admin"), getAllFoodController);
router.post("/add", restrictTo("Admin"), addFoodController);
router.post("/update/:id", restrictTo("Admin"), updateFoodController);
router.delete("/delete", restrictTo("Admin"), deleteFoodController);
router.post("/reviews/add/:id", addReviewController);
router.patch("/reviews/update/:id", updateReviewController);
router.get("/reviews/:id", getReviewsContoller);