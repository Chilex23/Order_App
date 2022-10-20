import {
  updatePasswordValidator,
  updateProfileValidator,
} from "../validators/users.js";
import {
  updateUserPassword,
  updateUserDetails,
  checkUsername,
} from "../services/users.js";

export const updateUserProfile = async (req, res, next) => {
  const validateResult = updateProfileValidator(req.body);
  if (validateResult.error) {
    return res
      .status(400)
      .json({ message: validateResult.error.message, success: false });
  }
  try {
    const { username } = req.user;
    if (req.body.username) {
      if (!(await checkUsername(req.body.username)) && req.body.username !== username ) {
        return res.status(400).json({ message: "Username is not available", success: false });
      }
      await updateUserDetails(username, req.body);
      return res
        .status(200)
        .json({ message: "User updated successfully", success: true });
    }
  } catch (e) {
    console.log("error", e);
    next(e);
  }
};

export const changeUserPassword = async (req, res, next) => {
  const validateResult = updatePasswordValidator(req.body);
  if (validateResult.error) {
    return res
      .status(400)
      .json({ message: validateResult.error.message, success: false });
  }
  const { username } = req.user;
  //   console.log("user", req.user);
  const { oldPassword, newPassword } = req.body;
  try {
    if (await updateUserPassword(username, oldPassword, newPassword)) {
      return res
        .status(200)
        .json({ message: "Password updated successfully", success: true });
    } else {
      return res
        .status(401)
        .send({ message: "Incorrect password", success: false });
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
      return res
        .status(200)
        .json({ message: "Username is available", success: true });
    } else {
      return res
        .status(200)
        .json({ message: "Username is not available", success: false });
    }
  } catch (e) {
    console.log("error", e);
    next(e);
  }
};
