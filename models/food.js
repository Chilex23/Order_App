import mongoose from "mongoose";

const { Schema, model } = mongoose;

const food = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageLink: { type: String },
  dateAdded: { type: Date, default: Date.now() },
  price: { type: Number, required: true },
});

const Food = model("Food", food);

export default Food;