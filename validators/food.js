import Joi from "joi";

export const foodValidator = (body) => {
  const schema = Joi.object().keys({
    title: Joi.string().max(40).required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    category: Joi.string().required()
  });
  return schema.validate(body);
};

export const updateFoodValidator = (body) => {
  const schema = Joi.object().keys({
    title: Joi.string().max(40),
    description: Joi.string(),
    price: Joi.number(),
  });
  return schema.validate(body);
};

export const addReviewValidator = (body) => {
  const schema = Joi.object().keys({
    // reviewer: Joi.string().required(),
    rating: Joi.number().required(),
    comment: Joi.string().required(),
  });
  return schema.validate(body);
};
