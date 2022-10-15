import Food from "../models/food.js";

export const addFood = async (body, next) => {
  try {
    const food = await Food.create({
      title: body.title,
      description: body.description,
      price: body.price,
    });
    return food;
  } catch (e) {
    console.log("error in add function", e)
    next(e);
  }
};
