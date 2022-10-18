import express from "express";
import {
  createOrderController,
  getUserOrdersController,
  deleteOrderController,
  getOrderController,
  deliveredOrderController
} from "../controllers/orders.js";
export const router = express.Router();

router.get("/", getOrderController);
router.post("/create", createOrderController);
router.get("/:id", getUserOrdersController);
router.delete("/delete", deleteOrderController);
router.post("/deliver/:id", deliveredOrderController);
