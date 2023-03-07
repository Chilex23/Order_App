import express from "express";
import passport from "passport";
import {
  createOrderController,
  getOrdersController,
  deleteOrderController,
  getOrderController,
  deliveredOrderController
} from "../controllers/orders.js";
export const router = express.Router();

router.use(passport.authenticate("jwt", { session: false }));
router.get("/", getOrdersController);
router.get("/:id", getOrderController);
router.post("/create", createOrderController);
router.delete("/delete/:id", deleteOrderController);
router.patch("/deliver/:id", deliveredOrderController);
