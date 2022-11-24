import { v4 as uuidv4 } from "uuid";
import Food from "../models/food.js";
import Category from "../models/category.js";
import { AvgRating } from "../utils/AvgRating.js";
import * as fsPromisify from "fs/promises";
import { constants, existsSync } from "fs";
import path from "path";
import { __dirname } from "../app.js";

export const addFood = async (body) => {
  try {
    const food = await Food.create({
      uuid: uuidv4(),
      title: body.title,
      description: body.description,
      price: body.price,
      imageLink: body.foodImageLink,
      category: body.category,
    });
    return food;
  } catch (e) {
    e.status = 400;
    throw e;
  }
};

export const getFood = async (id) => {
  try {
    const food = await Food.findOne({ uuid: id });
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

export const getAllFood = async (pageNo, filter, next) => {
  try {
    let findFilter = filter ? { category: filter } : {};
    let currentPage = Number(pageNo) || 1;
    const FOOD_ITEMS_PER_PAGE = 10;
    let start = (pageNo - 1) * FOOD_ITEMS_PER_PAGE;
    let end = start + FOOD_ITEMS_PER_PAGE;
    const selection = await Food.find(findFilter).sort({ dateAdded: "desc" });

    if (selection.length == 0) {
      const error = new Error("Could not find food items for this category.");
      error.status = 404;
      return next(error);
    }

    let totalFoodItems = selection.length;
    let totalPages = Math.ceil(totalFoodItems / FOOD_ITEMS_PER_PAGE);
    if (currentPage > totalPages) {
      let error = new Error("Page no is out of range.");
      error.status = 400;
      return next(error);
    }
    let foodItems = selection.slice(start, end);
    return { foodItems, totalFoodItems, currentPage, totalPages };
  } catch (e) {
    next(e);
  }
};

export const editFood = async (id, body, next) => {
  try {
    const food = await Food.updateOne({ uuid: id }, { $set: body });
    const foodItem = await Food.findOne({ uuid: id });
    return { isUpdated: food.acknowledged, data: foodItem };
  } catch (e) {
    console.log("error in edit food function", e);
    next(e);
  }
};

export const deleteFood = async (id, next) => {
  try {
    const foodItem = await Food.findOne({ uuid: id });
    if (foodItem.imageLink) {
      const filename = path.join(__dirname, foodItem.imageLink);
      if (existsSync(filename)) {
        console.log("file exists");
        await fsPromisify.unlink(filename);
      } else {
        console.log("file not found!");
      }
    }
    const order = await Food.deleteOne({ uuid: id });
    return order.acknowledged;
  } catch (e) {
    e.status = 400;
    next(e);
  }
};

export const addCategory = async (body) => {
  try {
    const newCategory = await Category.create(body);
    return newCategory;
  } catch (e) {
    e.status = 400;
    throw e;
  }
};

export const addReview = async (id, user, body) => {
  try {
    const food = await Food.findOne({ uuid: id });
    if (!food) {
      const error = new Error("Can't find food item, check the id.");
      error.status = 400;
      throw error;
    }
    let alreadyReviewed = food.reviews ? food?.reviews[user] : null;
    if (alreadyReviewed) {
      return false;
    }
    food.reviews = {
      ...food.reviews,
      [user]: {
        ...body,
      },
    };
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
    const food = await Food.findOne({ uuid: id });
    if (!food) {
      const error = new Error("Can't find food item, check the id.");
      error.status = 400;
      throw error;
    }

    food.reviews = {
      ...food.reviews,
      [user]: {
        ...body,
      },
    };
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
    const food = await Food.findOne({ uuid: id });
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
    const food = await Food.findOne({ uuid: id });
    if (!food.reviews[user]) {
      const error = new Error("Can't find review for this food item.");
      error.status = 404;
      throw error;
    }
    const newObj = {
      ...food.reviews,
    };
    delete newObj[user];
    food.reviews = {
      ...newObj,
    };
    food.avgRating = AvgRating(food.reviews);
    await food.save();
    return true;
  } catch (e) {
    throw e;
  }
};
