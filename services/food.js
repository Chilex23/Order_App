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
    console.log("error in add function", e);
    next(e);
  }
};

export const getAllFood = async (next) => {
  try {
    const foods = await Food.find({});
    return foods;
  } catch (e) {
    next(e);
  }
};

export const editFood = async (id, body, next) => {
  try {
    const food = await Food.updateOne({ _id: id }, { $set: body });
    return food.acknowledged;
  } catch (e) {
    console.log("error in edit food function", e);
    next(e);
  }
};

export const deleteFood = async (id, next) => {
  try {
    const order = await Food.deleteOne({_id: id });
    console.log(order.acknowledged)
    return order.acknowledged;
  } catch (e) {
    // console.log("Del food error", e)
    e.status = 400;
    next(e)
  }
} 