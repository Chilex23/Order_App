import Joi from "joi";

export const createOrderValidator = (body) => {
  const schema = Joi.object().keys({
    items: Joi.array().required(),
  });
  return schema.validate(body);
};
