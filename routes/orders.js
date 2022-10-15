import express from "express";
import { createOrderController } from "../controllers/orders.js";
export const router = express.Router();

router.post("/create", createOrderController);