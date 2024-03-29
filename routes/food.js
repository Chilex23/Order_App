import express from "express";
import passport from "passport";
import { restrictTo } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import {
  addFoodController,
  addCategoryController,
  getCategoriesController,
  updateFoodController,
  getAllFoodController,
  getFoodController,
  getFoodsByCategoryController,
  deleteFoodController,
  addReviewController,
  updateReviewController,
  getReviewsContoller,
  deleteReviewController,
} from "../controllers/food.js";

export let router = express.Router();

router.get("/", getAllFoodController);
router.get("/:id", getFoodController);
router.get("/category/all", getCategoriesController);
router.get("/category/:category", getFoodsByCategoryController);

router.use(passport.authenticate("jwt", { session: false }));
router.post("/add", restrictTo("Admin"), upload.single("foodImage"), addFoodController);
router.patch("/update/:id", restrictTo("Admin"), updateFoodController);
router.delete("/delete/:id", restrictTo("Admin"), deleteFoodController);
router.post("/category/add", restrictTo("Admin"), addCategoryController);

router.post("/reviews/add/:id", addReviewController);
router.patch("/reviews/update/:id", updateReviewController);
router.get("/reviews/:id", getReviewsContoller);
router.delete("/reviews/delete/:id", deleteReviewController);
