import mongoose from "mongoose";

const { Schema, model } = mongoose;

const OrderSchema = new Schema({
  uuid: { type: String, required: true },
  ordered_by: { type: String, required: true },
  order_date: { type: Date, default: Date.now() },
  state: { type: Number, default: 0 },
  total_price: Number,
  items: [{ name: String, id: String, price: Number, quantity: Number }],
});

const Order = model("Order", OrderSchema);

export default Order;
