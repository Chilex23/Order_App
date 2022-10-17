import { createOrder, getOrders, deleteOrder } from "../services/orders.js";
import { getToken } from "../helpers/auth.js";
import { createOrderValidator } from "../validators/orders.js";

export const createOrderController = async (req, res, next) => {
  let token = getToken(req);
  const validationResult = createOrderValidator(req.body);
  if (validationResult.error) {
    return res.status(400).json({ message: validationResult.error.message });
  }
  console.log(token);
  console.log("user", req.user);
  const newOrder = await createOrder(req.body, next);
  return res.status(200).json({
    message: "Order created successfully",
    ordered_by: newOrder.created_by,
    token: token,
  });
};

export const getUserOrderController = async (req, res, next) => {
  try {
    let pageNo = req.query.page;
    let user = req.params.id;
    console.log(req.user);
    // console.log(pageNo);
    const { orders, totalOrders, currentPage, totalPages } = await getOrders(
      pageNo,
      user,
      next
    );
    if (!orders || orders.length == 0)
      return res
        .status(400)
        .json({ message: "Bad Request, check the username or the page No." });
    return res
      .status(200)
      .json({ orders, totalOrders, currentPage, totalPages });
  } catch (e) {
    console.log("get order error", e);
    next(e);
  }
};

export const deleteOrderController = async (req, res, next) => {
  try {
    let id = req.query.id;
    let { username } = req.user;
    console.log(req.user);
    if (await deleteOrder(username, id, next))
      return res.status(200).json({ message: "Deleted successfully" });
    else return res.status(400).json({ message: "Bad request" });
  } catch (e) {
    console.log("delete order error", e);
    next(e);
  }
};
