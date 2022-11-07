import Food from "../models/food.js";
import { AvgRating } from "../utils/AvgRating.js";

export const addFood = async (body) => {
  try {
    const food = await Food.create({
      title: body.title,
      description: body.description,
      price: body.price,
      imageLink: body.foodImageLink,
    });
    return food;
  } catch (e) {
    e.status = 400;
    throw e;
  }
};

export const getFood = async (id) => {
  try {
    const food = await Food.findById(id);
    if (!food) {
      const error = new Error("No food item found");
      error.status = 404;
      throw error;
    }
    return food;
  } catch (e) {
    e.status = 400;
    throw e;
  }
};

export const getAllFood = async (pageNo, next) => {
  try {
    let currentPage = Number(pageNo) || 1;
    const FOOD_ITEMS_PER_PAGE = 10;
    let start = (pageNo - 1) * FOOD_ITEMS_PER_PAGE;
    let end = start + FOOD_ITEMS_PER_PAGE;
    const selection = await Food.find({}).sort({ dateAdded: "desc" });
    let totalFoodItems = selection.length;
    let totalPages = Math.ceil(totalFoodItems / FOOD_ITEMS_PER_PAGE);
    if (currentPage > totalPages) {
      let error = new Error("Page no is out of range.");
      error.status = 400;
      throw error;
    }
    let foodItems = selection.slice(start, end);
    return { foodItems, totalFoodItems, currentPage, totalPages };
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

export const deleteFood = async (title, next) => {
  try {
    const order = await Food.deleteOne({ title });
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
    food.avgRating = AvgRating(food.reviews);
    await food.save();
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
      _id: food.reviews[reviewedItemIndex]._id,
    };
    food.reviews[reviewedItemIndex] = review;
    food.avgRating = AvgRating(food.reviews);
    await food.save();
    return true;
  } catch (e) {
    e.status = 400;
    throw e;
  }
};

export const getReviews = async (id) => {
  try {
    const food = await Food.findById(id);
    if (!food) {
      const error = new Error("No reviews found for this food item.");
      error.status = 400;
      throw error;
    }
    return food.reviews;
  } catch (e) {
    throw e;
  }
};

export const deleteReview = async (id, user) => {
  try {
    const food = await Food.findById(id);
    const reviewedItemIndex = food.reviews.findIndex(
      (el) => el.reviewer === user
    );
    if (reviewedItemIndex === -1) {
      const error = new Error("Can't find review for this food item.");
      error.status = 404;
      throw error;
    }
    food.reviews.splice(reviewedItemIndex, 1);
    food.avgRating = AvgRating(food.reviews);
    await food.save();
    return true;
  } catch (e) {
    throw e;
  }
};
