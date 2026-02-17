import {
  useEffect,
  useState,
  useCallback,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  fetchCategories,
  deleteCategory,
} from "../../features/category/categorySlice";

import { Filter, X } from "lucide-react";

import CategoryList from "./CategoryList";
import CreateCategoryForm from "./CategoryForm";

import DebounceSearch from "../../components/common/DebounceSearch"
import useDebounce from "../../hooks/useDebounce";

import {
  showSuccess,
  showError,
} from "../../components/common/toast.utils";

export default function CategoryPage({
  setEditData,
}) {
  const dispatch = useDispatch();

  const { categories, meta, loading } =
    useSelector((s) => s.category);

  /* ---------------- SEARCH STATE ---------------- */
  const [search, setSearch] =
    useState("");

  // Debounced value
  const debouncedSearch =
    useDebounce(search, 500);

  /* ---------------- MODAL ---------------- */
  const [openCreate, setOpenCreate] =
    useState(false);

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    dispatch(
      fetchCategories({
        search: debouncedSearch,
      })
    );
  }, [dispatch, debouncedSearch]);

  /* ---------------- CALLBACKS ---------------- */

  // Stable search handler
  const handleSearchChange =
    useCallback((value) => {
      setSearch(value);
    }, []);

  // Stable delete
  const handleDelete =
    useCallback(
      async (id) => {
        if (
          !window.confirm(
            "Delete category?"
          )
        )
          return;

        try {
          await dispatch(
            deleteCategory(id)
          ).unwrap();

          showSuccess(
            "Category deleted"
          );

          dispatch(
            fetchCategories({
              search:
                debouncedSearch,
            })
          );
        } catch (err) {
          showError(err);
        }
      },
      [dispatch, debouncedSearch]
    );

  // Stable status
  const handleStatusChange =
    useCallback((id, value) => {
      console.log(
        "Status:",
        id,
        value
      );
    }, []);

  /* ---------------- CREATE SUCCESS ---------------- */
  const handleCreateSuccess =
    useCallback(() => {
      setOpenCreate(false);

      dispatch(
        fetchCategories({
          search:
            debouncedSearch,
        })
      );
    }, [dispatch, debouncedSearch]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Categories
        </h1>

        <button
          onClick={() =>
            setOpenCreate(true)
          }
          className="
            bg-indigo-600 text-white
            px-4 py-2 rounded-lg shadow
            hover:bg-indigo-700
          "
        >
          + New Category
        </button>
      </div>

      {/* SEARCH (Optimized) */}
      <div className="bg-white p-4 rounded-xl shadow-sm border mb-4 flex items-center gap-3">

        <DebounceSearch
          value={search}
          onChange={
            handleSearchChange
          }
          placeholder="Search"
        />

        <button className="flex items-center gap-2 border px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100">
          <Filter size={18} />
          Filters
        </button>
      </div>

      {/* TABLE */}
      <CategoryList
        categories={categories}
        loading={loading}
        setEditData={setEditData}
        handleDelete={handleDelete}
        handleStatusChange={
          handleStatusChange
        }
      />

      {/* FOOTER */}
      <div className="flex justify-between px-2 py-4 text-xs text-gray-500">
        <span>
          Total: {meta?.total || 0}
        </span>
        <span>
          Page {meta?.page || 1}
        </span>
      </div>

      {/* CREATE DRAWER */}
      {openCreate && (
        <div className="fixed inset-0 z-50 flex">

          <div
            onClick={() =>
              setOpenCreate(false)
            }
            className="flex-1 bg-black/40 backdrop-blur-sm"
          />

          <div className="w-[420px] bg-white h-full shadow-xl border-l flex flex-col">

            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h2 className="font-semibold text-gray-800">
                Create Category
              </h2>

              <button
                onClick={() =>
                  setOpenCreate(false)
                }
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto">
              <CreateCategoryForm
                onSuccess={
                  handleCreateSuccess
                }
              />
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
