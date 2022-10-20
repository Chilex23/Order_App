import Joi from "joi";

export const signUpValidator = (body) => {
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().required().min(8),
    email: Joi.string().required().email(),
    role: Joi.string(),
  });
  return schema.validate(body);
};

export const loginValidator = (body) => {
  const schema = Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });
  return schema.validate(body);
};

export const updatePasswordValidator = (body) => {
  const schema = Joi.object().keys({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required().min(8),
  });
  return schema.validate(body);
};

export const updateProfileValidator = (body) => {
  const schema = Joi.object().keys({
    username: Joi.string(),
    name: Joi.string(),
    email: Joi.string().email(),
    imageLink: Joi.string(),
  });
  return schema.validate(body);
};
