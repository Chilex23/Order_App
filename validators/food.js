import Joi from "joi";

export const foodValidator = (body) => {
  const schema = Joi.object().keys({
    title: Joi.string().max(40).required(),
    description: Joi.string().required(),
    price: Joi.number()
  });
  return schema.validate(body);
};
