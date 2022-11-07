import mongoose from "mongoose";

const { Schema, model } = mongoose;

const FoodSchema = new Schema({
  uuid: { type: String, required: true, unique: true },
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  avgRating: { type: Number, default: 0 },
  imageLink: { type: String },
  dateAdded: { type: Date, default: Date.now() },
  price: { type: Number, required: true },
  reviews: [
    {
      reviewer: String,
      rating: { type: Number, min: 0, max: 5 },
      comment: String,
    },
  ],
});

const Food = model("Food", FoodSchema);

export default Food;
