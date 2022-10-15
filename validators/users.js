import Joi from "joi";

export const signUpValidator = (body) => {
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().required().min(8),
    email: Joi.string().required().email(),
  });
  return schema.validate(body);
};
