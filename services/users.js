import User from "../models/users.js";
import { passwordToHash } from "../helpers/auth.js";

export const updateUserDetails = async (username, body) => {
  const user = await User.updateOne({ username }, { $set: body });
  return user;
};

export const updateUserPassword = async (
  username,
  oldPassword,
  newPassword
) => {
  const user = await User.findOne({ username }).select("password");
  if (!(await user?.validatePassword(oldPassword))) {
    // The oldpassword is incorect
    return false;
  } else {
    await User.updateOne(
      { username },
      { $set: { password: passwordToHash(newPassword) } }
    );
    return true;
  }
};

export const checkUsername = async (username) => {
  const user = await User.findOne({ username });
  // console.log(user);
  if (!user) {
    // username is taken
    return true;
  } else {
    return false;
  }
};
