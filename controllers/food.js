import { foodValidator, updateFoodValidator } from "../validators/food.js";
import { addFood, getAllFood, editFood, deleteFood } from "../services/food.js";
import DBG from "debug";

const log = DBG("orderApp:food-controller");
const error = DBG("orderApp:food-controller-error");

export const addFoodController = async (req, res, next) => {
  try {
    const validationResult = foodValidator(req.body);
    console.log("body", req.body);
    if (validationResult.error) {
      return res
        .status(400)
        .json({ message: validationResult.error.message, success: false });
    }

    const foodResult = await addFood(req.body, next);
    res.status(201).json({
      message: "Food Item added successfully",
      data: foodResult,
      success: true,
    });
  } catch (e) {
    next(e);
  }
};

export const getAllFoodController = async (req, res, next) => {
  try {
    const allFood = await getAllFood(next);
    return res.status(200).json({ data: allFood, success: true });
  } catch (e) {
    next(e);
  }
};

export const updateFoodController = async (req, res, next) => {
  try {
    let id = req.params.id;
    const validationResult = updateFoodValidator(req.body);
    if (validationResult.error) {
      return res
        .status(400)
        .json({ message: validationResult.error.message, success: false });
    }
    const data = await editFood(id, req.body, next);
    if (!data) {
      const error = new Error("Edit failure");
      error.status = 400;
      throw error;
    }
    return res.status(200).json({ message: "success", success: data });
  } catch (e) {
    next(e);
  }
};

export const deleteFoodController = async (req, res, next) => {
  try {
    let id = req.query.id;
    if (await deleteFood(id, next))
      return res
        .status(200)
        .json({ message: "Deleted Food successfully", success: true });
  } catch (e) {
    console.log("Del ctrl food error", e);
    next(e);
  }
};
