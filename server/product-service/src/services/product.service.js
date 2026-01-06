const Product = require("../models/product.model");
const ApiError = require("../utils/ApiError");

const createProduct = async (data,userId) => {
  if (!data || typeof data !== "object") {
    throw new ApiError(400, "Invalid product payload");
  }

  if (!data.sku) {
    throw new ApiError(400, "SKU is required");
  }

  data.sku = data.sku.toUpperCase();

  const existing = await Product.findOne({ sku: data.sku });
  if (existing) {
    throw new ApiError(400, "Product with this SKU already exists");
  }

  const product = await Product.create({ ...data, createdBy: userId });
  return product;
};

const getProducts = async (filters) => {
  const {
    page = 1,
    limit = 10,
    search,
    category,
    sortBy = "createdAt",
    sortOrder = "desc",
    includeInactive = false,
  } = filters;

  const query = {};

  if (!includeInactive) {
    query.isActive = true;
  }

  if (category) {
    query.category = category;
  }

  if (search) {
    // basic text search across name / description / sku
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { sku: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const sort = {
    [sortBy]: sortOrder === "asc" ? 1 : -1,
  };

  const [items, total] = await Promise.all([
    Product.find(query).sort(sort).skip(skip).limit(limit),
    Product.countDocuments(query),
  ]);

  return {
    items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

const getProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  return product;
};

const updateProduct = async (id, data,userId) => {
  if (!data || typeof data !== "object") {
    throw new ApiError(400, "Invalid product payload");
  }

  if (data.sku) {
    data.sku = data.sku.toUpperCase();
  }

  const product = await Product.findByIdAndUpdate(id, {...data, updatedBy: userId}, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return product;
};

const deleteProduct = async (id,userId) => {
  // soft delete by marking inactive rather than removing the document
  const product = await Product.findByIdAndUpdate(
    id,
    { isActive: false ,deletedBy: userId, deletedAt: new Date() },
    { new: true }
  );

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return product;
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};

