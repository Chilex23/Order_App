import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const passwordToHash = (password) => bcrypt.hashSync(password, 10);

export const signToken = (body) => {
  return jwt.sign(body, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
