import { SignUpUser, createAuthToken } from "../services/auth.js";
import { signUpValidator } from "../validators/users.js";

export const signUpController = async (req, res, next) => {
  const validationResult = signUpValidator(req.body);
  if (validationResult.error) {
    console.log("enteres")
    return res.status(400).json({
      status: "Bad Request",
      message: validationResult.error.message,
    });
  }

  try {
    const newUser = await SignUpUser({ ...req.body }, next);
    const token = createAuthToken(newUser.id);
    res.status(201).json({
        status: "Success",
        message: "User signed up successfully",
        token,
    });
  } catch (e) {
    console.log("error", e)
    next()
  }

};
