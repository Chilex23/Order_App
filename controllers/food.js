import {
  foodValidator,
  updateFoodValidator,
  addReviewValidator,
  addCategoryValidator
} from "../validators/food.js";
import * as fs from "fs/promises";
import {
  addFood,
  getAllFood,
  getFood,
  editFood,
  deleteFood,
  addCategory,
  addReview,
  updateReview,
  getReviews,
  deleteReview,
} from "../services/food.js";
import DBG from "debug";

const log = DBG("orderApp:food-controller");
const error = DBG("orderApp:food-controller-error");

export const addFoodController = async (req, res, next) => {
  try {
    const validationResult = foodValidator(req.body);
    if (req?.file?.path) req.body.foodImageLink = req.file.path;

    if (validationResult.error) {
      await fs.rm(req.body.foodImageLink);
      return res
        .status(400)
        .json({ message: validationResult.error.message, success: false });
    }

    const foodResult = await addFood(req.body);
    res.status(201).json({
      message: "Food Item added successfully",
      data: foodResult,
      success: true,
    });
  } catch (e) {
    await fs.rm(req.body.foodImageLink);
    next(e);
  }
};

export const addCategoryController = async (req, res, next) => {
  try {
    const validationResult = addCategoryValidator(req.body);
    
    if (validationResult.error) {
      return res
        .status(400)
        .json({ message: validationResult.error.message, success: false });
    }

    const catgoryResult = await addCategory(req.body);
    res.status(201).json({
      message: "Category added successfully",
      data: catgoryResult,
      success: true,
    });
  } catch(e) {
    next(e)
  }
}

export const getAllFoodController = async (req, res, next) => {
  try {
    let pageNo = req.query.page;
    if (pageNo <= 0 || /\D{1,}/.test(pageNo))
      return res.status(400).json({
        message:
          "The page query parameter must be greater than 0 and must be a number",
        success: false,
      });
    const { foodItems, totalFoodItems, currentPage, totalPages } =
      await getAllFood(pageNo, null, next);
    if (!foodItems || foodItems.length == 0)
      return res.status(400).json({
        message: "Bad Request, No query parameter for page.",
        success: false,
      });
    return res.status(200).json({
      foodItems,
      totalFoodItems,
      currentPage,
      totalPages,
      success: true,
    });
  } catch (e) {
    next(e);
  }
};

export const getFoodsByCategoryController = async (req, res, next) => {
  try {
    let pageNo = req.query.page;
    const { category } = req.params;
    // const foods = await getFoodsByCategory(category, pageNo, next);
    const { foodItems, totalFoodItems, currentPage, totalPages } =
      await getAllFood(pageNo, category, next);
    if (!foodItems || foodItems.length == 0)
      return res.status(400).json({
        message: "Bad Request, No query parameter for page.",
        success: false,
      });
    return res.status(200).json({
      foodItems,
      totalFoodItems,
      currentPage,
      totalPages,
      success: true,
    })
  } catch (e) {
    next(e);
  }
}

export const getFoodController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const food = await getFood(id);
    return res.status(200).json({ data: food, success: true });
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
    const { isUpdated, data } = await editFood(id, req.body, next);
    if (!isUpdated) {
      const error = new Error("Edit failure");
      error.status = 400;
      throw error;
    }
    return res
      .status(200)
      .json({ message: "Edit successfull.", data, success: true });
  } catch (e) {
    next(e);
  }
};

export const deleteFoodController = async (req, res, next) => {
  try {
    let { id } = req.params;
    if (await deleteFood(id, next))
      return res
        .status(200)
        .json({ message: "Deleted Food successfully", success: true });
  } catch (e) {
    console.log("Del ctrl food error", e);
    next(e);
  }
};

export const addReviewController = async (req, res, next) => {
  try {
    const id = req.params.id;
    const validationResult = addReviewValidator(req.body);
    if (validationResult.error) {
      return res
        .status(400)
        .json({ message: validationResult.error.message, success: false });
    }
    const user = req.user.username || req.body.username;
    if (await addReview(id, user, req.body))
      res.status(201).json({ message: "Review Submitted", success: true });
    else
      res.status(400).json({
        message: "You have already reviewed this food.",
        success: false,
      });
  } catch (e) {
    console.log("add review food error", e);
    next(e);
  }
};

export const updateReviewController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user.username || req.body.username;
    const validationResult = addReviewValidator(req.body);
    if (validationResult.error) {
      return res
        .status(400)
        .json({ message: validationResult.error.message, success: false });
    }
    if (await updateReview(id, user, req.body))
      res.status(200).json({ message: "Review updated", success: true });
  } catch (e) {
    console.log("update review food error", e);
    next(e);
  }
};

export const getReviewsContoller = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reviews = await getReviews(id);
    res.status(200).json({ data: reviews, success: true });
  } catch (e) {
    console.log("get all reviews for a food error", e);
    next(e);
  }
};

export const deleteReviewController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user.username || req.body.username;
    if (await deleteReview(id, user))
      res.status(200).json({ message: "Review deleted", success: true });
  } catch (e) {
    next(e);
  }
};
