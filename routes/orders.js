import express from "express";
import {
  createOrderController,
  getUserOrderController,
  deleteOrderController,
} from "../controllers/orders.js";
export const router = express.Router();

router.post("/create", createOrderController);

router.get("/:id", getUserOrderController);

router.delete("/delete", deleteOrderController);
