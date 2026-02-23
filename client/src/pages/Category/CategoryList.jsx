import {
  ChevronDown,
  ChevronRight,
  Edit,
  Trash2,
  RotateCcw,
} from "lucide-react";

const CategoryList = ({
  categories,
  loading,
  setEditData,
  handleDelete,
  handleStatusChange,
  handleRestore, // 🔥 NEW
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

      <div className="grid grid-cols-5 gap-4 px-6 py-3 border-b bg-gray-50 text-sm font-medium text-gray-600">
        <div>Name</div>
        <div>Products</div>
        <div>Status</div>
        <div className="text-center col-span-2">
          Action
        </div>
      </div>

      {loading && (
        <div className="py-10 text-center text-sm">
          Loading...
        </div>
      )}

      {!loading &&
        categories.map((cat) => {

          const isDeleted =
            cat.status === "DELETED";

          return (
            <div
              key={cat._id}
              className="border-b last:border-none"
            >
              <div className="grid grid-cols-5 gap-4 px-6 py-4 items-center hover:bg-gray-50">

                {/* NAME */}
                <div className="flex items-center gap-2 font-medium text-gray-800">
                  {cat.children?.length ? (
                    <ChevronDown size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  )}
                  {cat.name}
                </div>

                {/* PRODUCTS */}
                <div className="text-sm text-gray-600">
                  {cat.productsCount || 0}
                </div>

                {/* STATUS */}
                <div>
                  <select
                    disabled={isDeleted}
                    value={cat.status}
                    onChange={(e) =>
                      handleStatusChange(
                        cat._id,
                        e.target.value
                      )
                    }
                    className="border rounded-lg px-3 py-1 text-sm bg-gray-50"
                  >
                    <option value="ACTIVE">
                      Active
                    </option>
                    <option value="INACTIVE">
                      Inactive
                    </option>
                    <option value="ARCHIVED">
                      Archived
                    </option>
                  </select>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-2 justify-center col-span-2">

                  {!isDeleted ? (
                    <>
                      <button
                        onClick={() =>
                          setEditData(cat)
                        }
                        className="bg-indigo-100 text-indigo-600 p-2 rounded-lg"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(cat._id)
                        }
                        className="bg-gray-100 text-gray-600 p-2 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() =>
                        handleRestore(cat._id)
                      }
                      className="bg-green-100 text-green-600 p-2 rounded-lg hover:bg-green-200"
                    >
                      <RotateCcw size={16} />
                    </button>
                  )}

                </div>

              </div>
            </div>
          );
        })}
    </div>
  );
};

export default CategoryList;