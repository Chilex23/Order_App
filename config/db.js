//Set up mongoose connection
import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URL;

const db = mongoose
  .connect(MONGO_URL, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.log("Connected successfully to Database");
  })
  .catch((e) => {
    console.log(e);
  });

export default db;
