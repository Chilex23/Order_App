import {
  createOrder,
  getOrders,
  deleteOrder,
  getOrder,
  updateOrder,
} from "../services/orders.js";
import { getToken } from "../helpers/auth.js";
import {
  createOrderValidator,
  deliverOrderValidator,
} from "../validators/orders.js";

export const createOrderController = async (req, res, next) => {
  let token = getToken(req);
  const validationResult = createOrderValidator(req.body);
  if (validationResult.error) {
    return res
      .status(400)
      .json({ message: validationResult.error.message, success: false });
  } else if (req.body.items.length == 0) {
    return res
      .status(400)
      .json({ message: "Items must contain an object", success: false });
  }
  console.log(token);
  console.log("user", req.user);
  try {
    const { username } = req.user;
    const newOrder = await createOrder(req.body, username, next);
    return res.status(200).json({
      message: "Order created successfully",
      ordered_by: newOrder.created_by,
      data: newOrder,
      success: true,
      token: token,
    });
  } catch (e) {
    next(e);
  }
};

export const getUserOrdersController = async (req, res, next) => {
  try {
    let pageNo = req.query.page;
    let user = req.params.id;
    let sortFormat = req.query.sort;
    console.log(req.user);
    const { orders, totalOrders, currentPage, totalPages } = await getOrders(
      pageNo,
      user,
      sortFormat,
      next
    );
    if (!orders || orders.length == 0)
      return res.status(400).json({
        message: "Bad Request, check the username or the query parameter page.",
        success: false,
      });
    return res
      .status(200)
      .json({ orders, totalOrders, currentPage, totalPages, success: false });
  } catch (e) {
    console.log("get orders error", e);
    next(e);
  }
};

export const getOrderController = async (req, res, next) => {
  try {
    let id = req.query.id;
    let { username } = req.user;
    let order = await getOrder(id, username, next);
    if (!order)
      return res
        .status(404)
        .json({ message: "Order not found", success: false });
    return res.status(200).json({ data: order, success: true });
  } catch (e) {
    console.log("Get order controller error", e);
    next(e);
  }
};

export const deleteOrderController = async (req, res, next) => {
  try {
    let id = req.query.id;
    let { username } = req.user;
    console.log(req.user);
    if (await deleteOrder(username, id, next))
      return res
        .status(200)
        .json({ message: "Deleted successfully", success: true });
    else
      return res.status(400).json({ message: "Bad request", success: false });
  } catch (e) {
    console.log("delete order error", e);
    next(e);
  }
};

export const deliveredOrderController = async (req, res, next) => {
  try {
    const { state } = req.body;
    const { username } = req.user;
    const { id } = req.params;
    const validationResult = deliverOrderValidator(req.body);
    if (validationResult.error)
      return res
        .status(400)
        .json({ message: validationResult.error.message, success: false });
    if (await updateOrder(id, username, state, next))
      return res.status(200).json({ message: "Delivered", success: true });
  } catch (e) {
    next(e);
  }
};
