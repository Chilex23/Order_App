import express from "express";
import {
  createOrderController,
  getUserOrdersController,
  deleteOrderController,
  getOrderController
} from "../controllers/orders.js";
export const router = express.Router();

router.get("/", getOrderController);

router.post("/create", createOrderController);

router.get("/:id", getUserOrdersController);

router.delete("/delete", deleteOrderController);
