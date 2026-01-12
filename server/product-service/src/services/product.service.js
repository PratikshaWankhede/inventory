const Product = require("../models/product.model");
const ApiError = require("../utils/ApiError");



const createProduct = async (data, userId) => {
  if (!data || typeof data !== "object") {
    throw new ApiError(400, "Invalid product payload");
  }

  if (!data.sku) {
    throw new ApiError(400, "SKU is required");
  }

  if (!data.category) {
    throw new ApiError(400, "Category is required");
  }

  // 🔹 Normalize SKU
  data.sku = data.sku.toUpperCase();

  try {
    const product = await Product.create({
      ...data,
      createdBy: userId,   // audit handled by backend
    });

    return product;

  } catch (err) {
    // 🔹 Enterprise duplicate handling
    if (err.code === 11000) {
      throw new ApiError(409, "Product with this SKU already exists");
    }

    throw err;
  }
};

module.exports = {
  createProduct,
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

  const matchStage = {};

  // 🔹 Active filter
  if (!includeInactive) {
    matchStage.isActive = true;
  }

  // 🔹 Category filter
  if (category) {
    matchStage.category = category;
  }

  // 🔹 Search filter
  if (search) {
    matchStage.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { sku: { $regex: search, $options: "i" } },
    ];
  }

  const sortStage = {
    [sortBy]: sortOrder === "asc" ? 1 : -1,
  };

  const pipeline = [
    { $match: matchStage },

    // 🔹 Sort before pagination
    { $sort: sortStage },

    // 🔹 Facet = data + count in one query
    {
      $facet: {
        items: [
          { $skip: (page - 1) * limit },
          { $limit: limit },
        ],
        totalCount: [
          { $count: "count" },
        ],
      },
    },

    // 🔹 Normalize response
    {
      $project: {
        items: 1,
        total: { $ifNull: [{ $arrayElemAt: ["$totalCount.count", 0] }, 0] },
      },
    },
  ];

  const [result] = await Product.aggregate(pipeline);

  return {
    items: result.items,
    meta: {
      page,
      limit,
      total: result.total,
      totalPages: Math.ceil(result.total / limit) || 1,
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

