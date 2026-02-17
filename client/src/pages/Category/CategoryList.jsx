
import {
  ChevronDown,
  ChevronRight,
  Edit,
  Trash2,
} from "lucide-react";

const CreateList = ({
  categories,
  loading,
  setEditData,
  handleDelete,
  handleStatusChange,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

      {/* TABLE HEAD */}
      <div className="grid grid-cols-5 gap-4 px-6 py-3 border-b bg-gray-50 text-sm font-medium text-gray-600">
        <div>Name</div>
        <div>Products</div>
        <div>Status</div>
        <div className="text-center col-span-2">
          Action
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="py-10 text-center text-sm">
          Loading...
        </div>
      )}

      {/* TABLE BODY */}
      {!loading &&
        categories.map((cat) => (
          <div
            key={cat._id}
            className="border-b last:border-none"
          >
            {/* PARENT */}
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
                  value={cat.status || "Active"}
                  onChange={(e) =>
                    handleStatusChange(
                      cat._id,
                      e.target.value
                    )
                  }
                  className="
                    border rounded-lg px-3 py-1 text-sm
                    bg-gray-50 focus:ring-2
                    focus:ring-indigo-500 outline-none
                  "
                >
                  <option value="Active">
                    Active
                  </option>
                  <option value="Inactive">
                    Inactive
                  </option>
                </select>
              </div>

              {/* ACTION */}
              <div className="flex gap-2 justify-center col-span-2">

                <button
                  onClick={() =>
                    setEditData(cat)
                  }
                  className="bg-indigo-100 text-indigo-600 p-2 rounded-lg hover:bg-indigo-200"
                >
                  <Edit size={16} />
                </button>

                <button
                  onClick={() =>
                    handleDelete(cat._id)
                  }
                  className="bg-gray-100 text-gray-600 p-2 rounded-lg hover:bg-gray-200"
                >
                  <Trash2 size={16} />
                </button>

              </div>
            </div>

            {/* CHILDREN */}
            {cat.children?.map((sub) => (
              <div
                key={sub._id}
                className="grid grid-cols-5 gap-4 px-12 py-3 items-center bg-gray-50 border-t text-sm"
              >
                <div>{sub.name}</div>

                <div>
                  {sub.productsCount || 0}
                </div>

                <div>
                  <select
                    value={sub.status || "Inactive"}
                    onChange={(e) =>
                      handleStatusChange(
                        sub._id,
                        e.target.value
                      )
                    }
                    className="
                      border rounded-lg px-3 py-1 text-sm
                      bg-white focus:ring-2
                      focus:ring-indigo-500 outline-none
                    "
                  >
                    <option value="Active">
                      Active
                    </option>
                    <option value="Inactive">
                      Inactive
                    </option>
                  </select>
                </div>

                <div className="flex gap-2 justify-center col-span-2">

                  <button
                    onClick={() =>
                      setEditData(sub)
                    }
                    className="bg-indigo-100 text-indigo-600 p-2 rounded-lg"
                  >
                    <Edit size={14} />
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(sub._id)
                    }
                    className="bg-gray-100 text-gray-600 p-2 rounded-lg"
                  >
                    <Trash2 size={14} />
                  </button>

                </div>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
};

export default CreateList;
