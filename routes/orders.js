import express from "express";
import passport from "passport";
import { restrictTo } from "../middleware/auth.js";
import {
  createOrderController,
  getUserOrdersController,
  getAllOrderController,
  deleteOrderController,
  getOrderController,
  deliveredOrderController
} from "../controllers/orders.js";
export const router = express.Router();

router.use(passport.authenticate("jwt", { session: false }));
router.get("/", getOrderController);
router.get("/all", restrictTo("Admin"), getAllOrderController);
router.post("/create", createOrderController);
router.get("/:user", getUserOrdersController);
router.delete("/delete/:id", deleteOrderController);
router.patch("/deliver/:id", deliveredOrderController);
