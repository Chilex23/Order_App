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

export const getOrders = async (pageNo, user, next) => {
  try {
    const filter = user ? { created_by: user } : {};
    let currentPage = Number(pageNo) || 1;
    const ORDERS_PER_PAGE = 10;
    let start = (pageNo - 1) * ORDERS_PER_PAGE;
    let end = start + ORDERS_PER_PAGE;
    const selection = await Order.find(filter).sort({ order_date: "desc" });
    let totalOrders = selection.length;
    let totalPages = Math.ceil(totalOrders / ORDERS_PER_PAGE);
    let orders = selection.slice(start, end);
    return { orders, totalOrders, currentPage, totalPages };
  } catch (e) {
    console.log("Error paginating", e);
    next(e);
  }
};

export const deleteOrder = async (user, id, next) => {
  try {
    const filter = user ? { created_by: user, _id: id } : { _id: id };
    const order = await Order.deleteOne(filter);
    console.log("delete order", order);
    return true;
  } catch (e) {
    console.log("Error deleting order", e);
    next(e);
  }
};

export const getOrder = async (id, user, next) => {
  try {
    const filter = user ? { created_by: user, _id: id } : { _id: id };
    const order = await Order.findById(filter);
    // console.log("Get order", order);
    return order;
  } catch (e) {
    console.log("Error getting order", e);
    next(e);
  }
};
