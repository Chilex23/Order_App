import Order from "../models/orders.js";

export const createOrder = async (body, user, next) => {
  try {
    console.log(body);
    const { items } = body;
    let total_price = items.reduce(
      (acc, el) => acc + el.price * el.quantity,
      0
    );
    const newOrder = await Order.create({
      ...body,
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
    const sort =
      sortFormat == "price" ? { total_price: "desc" } : { order_date: "desc" };
    let currentPage = Number(pageNo) || 1;
    const ORDERS_PER_PAGE = 10;
    let start = (pageNo - 1) * ORDERS_PER_PAGE;
    let end = start + ORDERS_PER_PAGE;
    const selection = await Order.find(filter).sort(sort);
    let totalOrders = selection.length;
    let totalPages = Math.ceil(totalOrders / ORDERS_PER_PAGE);
    let orders = selection.slice(start, end);
    return { orders, totalOrders, currentPage, totalPages };
  } catch (e) {
    console.log("Error paginating", e);
    next(e);
  }
};

export const deleteOrder = async (user, id) => {
  try {
    const filter = user ? { created_by: user, _id: id } : { _id: id };
    const order = await Order.deleteOne(filter);
    console.log("delete order", order);
    return order.acknowledged;
  } catch (e) {
    // console.log("Error deleting order", e);
    e.message = "Order ID is incorrect";
    e.status = 400;
    throw e;
  }
};

export const getOrder = async (id, user) => {
  try {
    const filter = user ? { ordered_by: user, _id: id } : { _id: id };
    const order = await Order.findOne(filter);
    // console.log("Get order", order);
    return order;
  } catch (e) {
    console.log("Error getting order", e);
    e.message = "The Order ID query parameter is wrong or undefined";
    e.status = 400;
    throw e;
  }
};

export const updateOrder = async (id, user, state, next) => {
  try {
    const filter = user ? { ordered_by: user, _id: id } : { _id: id };
    console.log(filter);
    await Order.findByIdAndUpdate(filter, { $set: { state } });
    return true;
  } catch (e) {
    e.status = 400;
    e.message = "Order was not found";
    next(e);
  }
};
