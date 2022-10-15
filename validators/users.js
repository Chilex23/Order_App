import Joi from "joi";

export const signUpValidator = (body) => {
  const schema = Joi.object().keys({
    name: Joi.string(),
    username: Joi.string(),
    password: Joi.string().min(8),
    email: Joi.string().email(),
  });
  return schema.validate(body);
};
