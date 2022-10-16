import { updatePasswordValidator, updateProfileValidator } from "../validators/users.js";
import {
  updateUserPassword,
  updateUserDetails,
  checkUsername,
} from "../services/users.js";

export const updateUserProfile = async (req, res, next) => {
  const validateResult = updateProfileValidator(req.body);
  if (validateResult.error) {
    return res.status(400).json({ message: validateResult.error.message });
  }
  try {
    const { username } = req.user;
    // if (!(await checkUsername(req.body.username))) {
    //   return res.status(400).json({ message: "Username is not available" });
    // }
    await updateUserDetails(username, req.body);
    return res
      .status(200)
      .json({ status: "success", message: "User updated successfully" });
  } catch (e) {
    console.log("error", e);
    next(e);
  }
};

export const changeUserPassword = async (req, res, next) => {
  const validateResult = updatePasswordValidator(req.body);
  if (validateResult.error) {
    return res.status(400).json({ message: validateResult.error.message });
  }
  const { username } = req.user;
  //   console.log("user", req.user);
  const { oldPassword, newPassword } = req.body;
  try {
    if (await updateUserPassword(username, oldPassword, newPassword, res)) {
      return res
        .status(200)
        .json({ status: "success", message: "Password updated successfully" });
    } else {
      return res.status(401).send({ message: "Incorrect password" });
    }
  } catch (e) {
    console.log("error", e);
    next(e);
  }
};

export const checkAvailableUsername = async (req, res, next) => {
  const { username } = req.body;
  try {
    if (await checkUsername(username)) {
      return res.status(200).json({ message: "Username is available" });
    } else {
      return res.status(200).json({ message: "Username is not available" });
    }
  } catch (e) {
    console.log("error", e);
    next(e);
  }
};
