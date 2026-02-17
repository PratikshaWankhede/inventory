import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { categorySchema } from "../../validation/category.validation";
import { createCategory } from "../../features/category/categorySlice";

import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import {
  showSuccess,
  showError,
} from "../../components/common/toast.utils";

const CreateCategoryForm = ({  onSuccess,}) => {
  const dispatch = useDispatch();

  const { loading, error } = useSelector(
    (state) => state.category
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(categorySchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name.trim().toLowerCase(),
      };

      await dispatch(createCategory(payload)).unwrap();

      showSuccess("Category created successfully");
      reset();
       onSuccess?.();
    } catch (err) {
      showError(err || "Failed to create category");
    }
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm">

      {/* HEADER */}
      <div className="border-b px-5 py-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Create Category
        </h2>
      </div>

      {/* BODY */}
      <div className="p-5 space-y-4">

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-2 rounded">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Input
            type="text"
            label="Category Name"
            placeholder="Enter category name"
            {...register("name")}
            error={errors.name}
          />

          <Button
            type="submit"
            loading={loading}
            disabled={!isValid || loading}
          >
            Create Category
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateCategoryForm;
