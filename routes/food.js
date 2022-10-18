import express from "express";
import {
  addFoodController,
  updateFoodController,
  getAllFoodController,
  deleteFoodController,
} from "../controllers/food.js";

export let router = express.Router();

router.get("/", getAllFoodController);
router.post("/add", addFoodController);
router.post("/update/:id", updateFoodController);
router.delete("/delete", deleteFoodController);