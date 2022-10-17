import express from "express";
import { createOrderController, getUserOrderController } from "../controllers/orders.js";
export const router = express.Router();

router.post("/create", createOrderController);

router.get("/:id", getUserOrderController);