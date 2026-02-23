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
  updateCategoryStatus,
  restoreCategory
} from "../../features/category/categorySlice";

import { FiPlus } from "react-icons/fi";

import CategoryList from "./CategoryList";
import CreateCategoryForm from "./CategoryForm";
import DebounceSearch from "../../components/common/DebounceSearch";
import useDebounce from "../../hooks/useDebounce";
import Modal from "../../components/common/Modal";
import Pagination from "../../components/common/Pagination";
import {
  showSuccess,
  showError,
} from "../../components/common/toast.utils";

export default function CategoryPage({ setEditData }) {

  const dispatch = useDispatch();

  const { categories, meta, loading } =
    useSelector((s) => s.category);

  /* ---------------- STATES ---------------- */
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const debouncedSearch = useDebounce(search, 500);
  const [openCreate, setOpenCreate] =
    useState(false);

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    dispatch(
      fetchCategories({
        search: debouncedSearch,
        page,
        limit: 3,
        status: statusFilter,
      })
    );
  }, [dispatch, debouncedSearch, page, statusFilter]);

  /* ---------------- CALLBACKS ---------------- */

  const handleSearchChange = useCallback(
    (value) => {
      setSearch(value);
      setPage(1);
    },
    []
  );

  const handlePageChange = useCallback(
    (p) => {
      setPage(p);
    },
    []
  );

  const handleDelete = useCallback(
    async (id) => {
      if (!window.confirm("Delete category?"))
        return;

      try {
        await dispatch(
          deleteCategory(id)
        ).unwrap();

        showSuccess("Category deleted");

        // 🔥 Refresh after delete
        dispatch(
          fetchCategories({
            search: debouncedSearch,
            page,
            limit: 3,
            status: statusFilter,
          })
        );

      } catch (err) {
        showError(err);
      }
    },
    [dispatch, debouncedSearch, page, statusFilter]
  );

  const handleStatusChange =
    useCallback(
      async (id, newStatus) => {
        try {
          await dispatch(
            updateCategoryStatus({
              id,
              status: newStatus,
            })
          ).unwrap();

          showSuccess("Status updated");

        } catch (err) {
          showError(err);
        }
      },
      [dispatch]
    );

  const handleCreateSuccess =
    useCallback(() => {
      setOpenCreate(false);
    }, []);

    const handleRestore = useCallback(
  async (id) => {

    if (!window.confirm("Restore this category?"))
      return;

    try {
      await dispatch(
        restoreCategory(id)
      ).unwrap();

      showSuccess("Category restored");

      dispatch(
        fetchCategories({
          search: debouncedSearch,
          page,
          limit: 3,
          status: statusFilter,
        })
      );

    } catch (err) {
      showError(err);
    }
  },
  [dispatch, debouncedSearch, page, statusFilter]
);

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-semibold">
          Categories
        </h1>

        <button
          onClick={() => setOpenCreate(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          <FiPlus />
          New Category
        </button>
      </div>

      {/* SEARCH + FILTER */}
      <div className="bg-white p-4 rounded-xl shadow border mb-4 flex gap-3">

        <DebounceSearch
          value={search}
          onChange={handleSearchChange}
          placeholder="Search category..."
        />

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="border px-3 py-2 rounded-lg bg-gray-50"
        >
          <option value="ALL">All</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="ARCHIVED">Archived</option>
          <option value="DELETED">Deleted</option>
        </select>
      </div>

      <CategoryList
        categories={categories}
        loading={loading}
        setEditData={setEditData}
        handleDelete={handleDelete}
        handleStatusChange={handleStatusChange}
         handleRestore={handleRestore}
      />

      <Pagination
        page={meta?.page || 1}
        limit={meta?.limit || 3}
        total={meta?.total || 0}
        onPageChange={handlePageChange}
      />

      <Modal
        isOpen={openCreate}
        onClose={() => setOpenCreate(false)}
        title="Create Category"
      >
        <CreateCategoryForm
          onSuccess={handleCreateSuccess}
        />
      </Modal>
    </div>
  );
}