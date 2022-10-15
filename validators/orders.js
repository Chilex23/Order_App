import Joi from "joi";

export const createOrderValidator = (body) => {
  const schema = Joi.object().keys({
    created_by: Joi.string().required(),
    items: Joi.array().required(),
  });
  return schema.validate(body);
};
