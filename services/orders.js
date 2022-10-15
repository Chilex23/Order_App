import Order from "../models/orders.js";

export const createOrder = async (body, next) => {
  try {
    console.log(body);
    const { items } = body;
    let total_price = items.reduce((acc, el) => acc + el.price * el.quantity, 0);
    const newOrder = await Order.create({ ...body, total_price });
    return newOrder;
  } catch (e) {
    console.log("Error creating order", e);
    next(e);
  }
};
