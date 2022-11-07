import express from "express";
import passport from "passport";
import { restrictTo } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import {
  addFoodController,
  updateFoodController,
  getAllFoodController,
  getFoodController,
  deleteFoodController,
  addReviewController,
  updateReviewController,
  getReviewsContoller,
  deleteReviewController,
} from "../controllers/food.js";

export let router = express.Router();

router.use(passport.authenticate("jwt", { session: false }));
router.get("/", restrictTo("Admin"), getAllFoodController);
router.get("/:id", restrictTo("Admin"), getFoodController);
router.post("/add", restrictTo("Admin"), upload.single("foodImage"), addFoodController);
router.patch("/update/:id", restrictTo("Admin"), updateFoodController);
router.delete("/delete/:id", restrictTo("Admin"), deleteFoodController);
router.post("/reviews/add/:id", addReviewController);
router.patch("/reviews/update/:id", updateReviewController);
router.get("/reviews/:id", getReviewsContoller);
router.delete("/reviews/delete/:id", deleteReviewController);
