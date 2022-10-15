import express from "express";
import { addFoodController } from "../controllers/food.js";

export let router = express.Router()

router.post("/add", addFoodController);