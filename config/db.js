//Set up mongoose connection
import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config()

const MONGO_URL = process.env.MONGO_URL;

mongoose.Promise = global.Promise;
console.log('Mongo url', MONGO_URL);


const db = mongoose
  .connect(MONGO_URL, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.log("Connected successfully to Database");
  })
  .catch((e) => {
    console.log(e);
  });

export default db;
