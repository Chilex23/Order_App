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
      .json({ message: "Items Array must contain an object", success: false });
  }
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
    // Only users can view their orders
    if (req.user.username !== user)
      return res
        .status(401)
        .json({ message: "You can't view this order", success: false });
    if (!orders || orders.length == 0)
      return res.status(400).json({
        message: "Bad Request, check the username or the query parameter page.",
        success: false,
      });
    return res
      .status(200)
      .json({ orders, totalOrders, currentPage, totalPages, success: true });
  } catch (e) {
    console.log("get orders error", e);
    next(e);
  }
};

export const getAllOrderController = async (req, res, next) => {
  try {
    let pageNo = req.query.page;
    if (pageNo <= 0 || /\D{1,}/.test(pageNo))
      return res
        .status(400)
        .json({ message: "The page query parameter must be greater than 0 and must be a number" });
    let sortFormat = req.query.sort;
    const { orders, totalOrders, currentPage, totalPages } = await getOrders(
      pageNo,
      null,
      sortFormat,
      next
    );
    if (!orders || orders.length == 0)
      return res.status(400).json({
        message: "Bad Request, No query parameter for page.",
        success: false,
      });
    return res
      .status(200)
      .json({ orders, totalOrders, currentPage, totalPages, success: true });
  } catch (e) {
    next(e);
  }
};

export const getOrderController = async (req, res, next) => {
  try {
    let id = req.query.id;
    if (!id)
      return res
        .status(400)
        .json({
          message: "Bad Request, No query parameter for id.",
          success: false,
        });
    let { username, role } = req.user;
    let order = await getOrder(id, username, role);
    if (!order)
      return res.status(404).json({
        message: "Order not found, you are not permitted to view this order",
        success: false,
      });

    return res.status(200).json({ data: order, success: true });
  } catch (e) {
    console.log("Get order controller error", e);
    next(e);
  }
};

export const deleteOrderController = async (req, res, next) => {
  try {
    let id = req.query.id;
    if (!id)
      return res.status(400).json({
        message: "Provide the order ID as a query paramter",
        success: false,
      });
    let { username } = req.user;
    if (req.user.role === "Admin") {
      // console.log(req.user);
      await deleteOrder(null, id);
    } else {
      // console.log(req.user);
      await deleteOrder(username, id);
    }
    return res
      .status(200)
      .json({ message: "Deleted successfully", success: true });
  } catch (e) {
    console.log("delete order error", e);
    next(e);
  }
};

export const deliveredOrderController = async (req, res, next) => {
  try {
    const { state } = req.body;
    const { username, role } = req.user;
    const { id } = req.params;
    const validationResult = deliverOrderValidator(req.body);
    if (validationResult.error)
      return res
        .status(400)
        .json({ message: validationResult.error.message, success: false });
    if (await updateOrder(id, username, role, state))
      return res.status(200).json({ message: "Delivered", success: true });
    else
      return res.status(401).json({
        message: "You are not permitted since this is not your order",
        success: false,
      });
  } catch (e) {
    next(e);
  }
};
