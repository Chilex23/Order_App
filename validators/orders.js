import Joi from "joi";

export const createOrderValidator = (body) => {
  const schema = Joi.object().keys({
    items: Joi.array().required(),
  });
  return schema.validate(body);
};

export const deliverOrderValidator = (body) => {
  const schema = Joi.object().keys({
    state: Joi.number().required()
  })
  return schema.validate(body);
}