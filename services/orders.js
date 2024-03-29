import { v4 as uuidv4 } from "uuid";
import Order from "../models/orders.js";

export const createOrder = async (body, user, next) => {
  try {
    const { items } = body;
    let total_price = items.reduce(
      (acc, el) => acc + el.price * el.quantity,
      0
    );
    const newOrder = await Order.create({
      ...body,
      uuid: uuidv4(),
      ordered_by: user,
      total_price,
    });
    return newOrder;
  } catch (e) {
    console.log("Error creating order", e);
    next(e);
  }
};

export const getOrders = async (pageNo, user, sortFormat, next) => {
  try {
    const filter = user ? { ordered_by: user } : {};
    // Sort the food items defaultly by date, unless specified by price.
    const sort =
      sortFormat == "price" ? { total_price: "desc" } : { order_date: "desc" };
    let currentPage = Number(pageNo) || 1;
    const ORDERS_PER_PAGE = 10;
    let start = (pageNo - 1) * ORDERS_PER_PAGE;
    let end = start + ORDERS_PER_PAGE;
    const selection = await Order.find(filter).sort(sort);
    if (selection.length == 0) {
      const error = new Error("Could not find orders for this user.");
      error.status = 404;
      return next(error);
    }

    let totalOrders = selection.length;
    let totalPages = Math.ceil(totalOrders / ORDERS_PER_PAGE);
    if (currentPage > totalPages) {
      let error = new Error("The query parameter 'page' is out of range.");
      error.status = 400;
      return next(error);
    }
    let orders = selection.slice(start, end);
    return { orders, totalOrders, currentPage, totalPages };
  } catch (e) {
    console.log("Error paginating", e);
    next(e);
  }
};

export const deleteOrder = async (user, id) => {
  try {
    // Only an admin can delete any order, a user can delete only his orders
    const filter = user ? { created_by: user, uuid: id } : { uuid: id };
    const order = await Order.deleteOne(filter);
    return order.acknowledged;
  } catch (e) {
    // console.log("Error deleting order", e);
    e.message = "Order id is incorrect";
    e.status = 400;
    throw e;
  }
};

export const getOrder = async (id, user, role) => {
  try {
    // Only an admin can get any order, a user can get only his orders
    const filter =
      user && role === "User" ? { ordered_by: user, uuid: id } : { uuid: id };
    const order = await Order.findOne(filter);
    // console.log("Get order", order);
    return order;
  } catch (e) {
    console.log("Error getting order", e);
    e.message = "The Order id query parameter is wrong or undefined";
    e.status = 400;
    throw e;
  }
};

export const updateOrder = async (id, user, role, state) => {
  try {
    // Only an admin can update any order, a user can update only his orders
    const filter =
      user && role === "User" ? { ordered_by: user, uuid: id } : { uuid: id };
    const order = await Order.findOneAndUpdate(filter, { $set: { state } });
    return order;
  } catch (e) {
    e.status = 400;
    e.message = "Order was not found";
    throw e;
  }
};
