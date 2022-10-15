import { foodValidator } from "../validators/food.js";
import { addFood } from "../services/food.js";
import DBG from "debug";

const log = DBG("orderApp:food-controller");
const error = DBG("orderApp:food-controller-error");

export const addFoodController = async (req, res, next) => {
  const validationResult = foodValidator(req.body);
  console.log("body", req.body)
  if (validationResult.error) {
    return res.status(400).json(validationResult.error.message);
  }

  console.log('entering here')
  const foodResult = await addFood(req.body, next);
  res.status(200).json({
    message: "Food Item added successfully",
    title: foodResult.title,
  });
};
