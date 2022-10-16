import { createOrder } from "../services/orders.js";
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
