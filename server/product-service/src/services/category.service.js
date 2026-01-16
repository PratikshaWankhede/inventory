const Category = require("../models/category.model");
const ApiError = require("../utils/ApiError");


exports.createCategory = async (data, userId) => {

  if (!data.name) {
    throw new ApiError(400, "Category name is required");
  }

  try {
    const category = await Category.create({
      ...data,
      createdBy: userId,
    });

    return category;
  } catch (err) {
    if (err.code === 11000) {
      throw new ApiError(409, "Category with this name already exists");
    }
    throw err;
  }
};

/* ---------------- LIST ---------------- */
exports.getCategories = async (filters) => {
  const {
    page = 1,
    limit = 10,
    search,
    sortBy = "createdAt",
    sortOrder = "desc",
    includeInactive = false,
  } = filters;

  const matchStage = {};

  if (!includeInactive) {
    matchStage.isActive = true;
  }

  if (search) {
    matchStage.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const sortStage = {
    [sortBy]: sortOrder === "asc" ? 1 : -1,
  };

  const pipeline = [
    { $match: matchStage },
    { $sort: sortStage },

    {
      $facet: {
        items: [
          { $skip: (page - 1) * limit },
          { $limit: Number(limit) },
        ],
        totalCount: [{ $count: "count" }],
      },
    },

    {
      $project: {
        items: 1,
        total: {
          $ifNull: [{ $arrayElemAt: ["$totalCount.count", 0] }, 0],
        },
      },
    },
  ];

  const [result] = await Category.aggregate(pipeline);

  return {
    items: result.items,
    meta: {
      page: Number(page),
      limit: Number(limit),
      total: result.total,
      totalPages: Math.ceil(result.total / limit) || 1,
    },
  };
};

/* ---------------- GET BY ID ---------------- */
exports.getCategoryById = async (id) => {
  const category = await Category.findById(id);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return category;
};

/* ---------------- UPDATE ---------------- */
exports.updateCategory = async (id, data, userId) => {
  if (!data || typeof data !== "object") {
    throw new ApiError(400, "Invalid category payload");
  }

  const category = await Category.findByIdAndUpdate(
    id,
    { ...data, updatedBy: userId },
    { new: true, runValidators: true }
  );

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return category;
};

/* ---------------- DELETE (SOFT) ---------------- */
exports.deleteCategory = async (id, userId) => {
  const category = await Category.findByIdAndUpdate(
    id,
    {
      isActive: false,
      deletedBy: userId,
      deletedAt: new Date(),
    },
    { new: true }
  );

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return category;
};
