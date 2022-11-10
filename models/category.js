import mongoose from "mongoose";

const { Schema, model } = mongoose;

const CategorySchema = new Schema({
  type: { type: String, required: true, unique: true },
});

const Category = model("Category", CategorySchema);

export default Category;
