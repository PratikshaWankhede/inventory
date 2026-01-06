const Joi = require("joi");

const baseProductSchema = {
  name: Joi.string().trim().min(2).max(100),
  sku: Joi.string().trim().alphanum().min(3).max(30),
  description: Joi.string().allow("").max(500),
  price: Joi.number().min(0),
  category: Joi.string().trim().allow("").max(100),
  isActive: Joi.boolean(),
};

const createProductSchema = Joi.object({
  name: baseProductSchema.name.required(),
  sku: baseProductSchema.sku.required(),
  description: baseProductSchema.description,
  price: baseProductSchema.price.required(),
  category: baseProductSchema.category,
  isActive: baseProductSchema.isActive,
});

const updateProductSchema = Joi.object(baseProductSchema).min(1);

const listProductsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().trim().allow(""),
  category: Joi.string().trim().allow(""),
  sortBy: Joi.string()
    .valid("name", "price", "quantity", "createdAt")
    .default("createdAt"),
  sortOrder: Joi.string().valid("asc", "desc").default("desc"),
  includeInactive: Joi.boolean().default(false),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
  listProductsSchema,
};
