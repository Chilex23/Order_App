import createError from "http-errors";
import * as dotenv from "dotenv";
dotenv.config()

import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import passport from "passport";
import util from "util";
import "./config/db.js";
import "./middleware/auth.js";
import logger from "morgan";
import { router as indexRouter } from "./routes/index.js";
import { router as foodRouter } from "./routes/food.js";
import { router as authRouter } from "./routes/auth.js";
import { router as userRouter } from "./routes/users.js";
import { router as orderRouter } from "./routes/orders.js";
import DBG from "debug";

const debug = DBG("orderApp:debug");
const error = DBG("orderApp:error");

// Workaround for lack of __dirname in ES6 modules
const __dirname = path.dirname(new URL(import.meta.url).pathname);

let app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", indexRouter);
app.use("/api/food", foodRouter);
app.use("/api/auth", authRouter);
app.use(
  "/api/users",
  passport.authenticate("jwt", { session: false }),
  userRouter
);
app.use(
  "/api/orders",
  passport.authenticate("jwt", { session: false }),
  orderRouter
);

process.on("uncaughtException", function (err) {
  error("I've crashed !!! - " + (err.stack || err));
});

process.on("unhandledRejection", (reason, p) => {
  error(`Unhandled Rejection at: ${util.inspect(p)} reason: ${reason}`);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  error(`APP ERROR HANDLER ${err.stack}`);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  error((err.status || 500) + " " + err.message);
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
