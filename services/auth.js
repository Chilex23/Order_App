import { signToken } from "../helpers/auth.js";
import { promisify } from "util";
import jwt from "jsonwebtoken";
import User from "../models/users.js";

export const SignUpUser = async (userBody, next) => {
  try {
    const newUser = await User.create(userBody);
    return newUser;
  } catch (e) {
    console.log("Userservices", userBody);
    console.log("error in sign user function", e);
    next(e);
  }
};

export const findUserById = async (id) => {
  const user = await User.findById(id);
  return user;
}

export const createAuthToken = (id) => {
  return signToken(id);
};

export const verifyAndDecodeToken = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  console.log(token);

  if (!token) {
    res.send(401, "Token is not present");
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  return decoded;
};
