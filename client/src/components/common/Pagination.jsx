import {
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

export default function Pagination({
  page = 1,
  limit = 3,
  total = 0,
  onPageChange,
}) {

  const totalPages =
    Math.ceil(total / limit) || 1;

  if (totalPages === 1) {return null};


  const getPages = () => {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div
      className="
        flex flex-col sm:flex-row
        items-center justify-between
        gap-3 mt-6
      "
    >
   
      <p className="text-sm text-gray-500">
        Page <b>{page}</b> of{" "}
       
      </p>


      <div className="flex items-center gap-1">

        {/* Prev */}
        <button
          onClick={() =>
            onPageChange(page - 1)
          }
          disabled={page === 1}
          className="
            p-2 border rounded-lg
            disabled:opacity-40
            hover:bg-gray-100
          "
        >
          <FiChevronLeft />
        </button>

        {/* Numbers */}
        {getPages().map((p) => (
          <button
            key={p}
            onClick={() =>
              onPageChange(p)
            }
            className={`
              px-3 py-1.5 border rounded-lg text-sm
              ${
                p === page
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "hover:bg-gray-100"
              }
            `}
          >
            {p}
          </button>
        ))}

        {/* Next */}
        <button
          onClick={() =>
            onPageChange(page + 1)
          }
          disabled={
            page === totalPages
          }
          className="
            p-2 border rounded-lg
            disabled:opacity-40
            hover:bg-gray-100
          "
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
}
