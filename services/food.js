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
    const order = await Food.deleteOne({ _id: id });
    console.log(order.acknowledged);
    return order.acknowledged;
  } catch (e) {
    // console.log("Del food error", e)
    e.status = 400;
    next(e);
  }
};

export const addReview = async (id, user, body) => {
  try {
    const review = { ...body, reviewer: user };
    const food = await Food.findById(id);
    if (!food) {
      const error = new Error("Can't find food item, check the id.");
      error.status = 400;
      throw error;
    }
    const alreadyReviewed = food.reviews.find((el) => el.reviewer === user);
    if (alreadyReviewed) {
      return false;
    }
    food.reviews.push(review);
    food.save();
    return true;
  } catch (e) {
    e.status = 400;
    throw e;
  }
};

export const updateReview = async (id, user, body) => {
  try {
    const food = await Food.findById(id);
    if (!food) {
      const error = new Error("Can't find food item, check the id.");
      error.status = 400;
      throw error;
    }
    const reviewedItemIndex = food.reviews.findIndex(
      (el) => el.reviewer === user
    );
    const review = {
      ...body,
      reviewer: user,
      _id: food.reviews[reviewedItemIndex]._id
    };
    food.reviews[reviewedItemIndex] = review;
    food.save();
    return true;
  } catch (e) {
    e.status = 400;
    throw e;
  }
};

export const getReviews = async (id) => {
  try {
    const food = await Food.findById(id);
    return food.reviews;
  } catch (e) {
    throw e;
  }
}
