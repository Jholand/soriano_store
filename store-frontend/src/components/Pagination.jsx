import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  itemsPerPage, 
  totalItems,
  onItemsPerPageChange 
}) {
  const pageNumbers = [];
  const maxVisiblePages = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl">
      {/* Items per page selector */}
      <div className="flex items-center gap-2 text-gray-700 text-sm font-medium">
        <span>Show</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="bg-white border border-gray-300 text-gray-900 px-3 py-1 rounded-lg focus:outline-none focus:border-yellow-400"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span>entries</span>
      </div>

      {/* Page info */}
      <div className="text-gray-700 text-sm font-medium">
        Showing {startItem} to {endItem} of {totalItems} entries
      </div>

      {/* Pagination buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-yellow-50 hover:border-yellow-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <FaChevronLeft />
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-3 py-1 rounded-lg border border-gray-300 text-gray-700 hover:bg-yellow-50 hover:border-yellow-400 transition-all"
            >
              1
            </button>
            {startPage > 2 && <span className="text-gray-500">...</span>}
          </>
        )}

        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`px-3 py-1 rounded-lg border transition-all ${
              currentPage === number
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 border-yellow-400 text-black font-semibold shadow-md'
                : 'border-gray-300 text-gray-700 hover:bg-yellow-50 hover:border-yellow-400'
            }`}
          >
            {number}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="text-gray-500">...</span>}
            <button
              onClick={() => onPageChange(totalPages)}
              className="px-3 py-1 rounded-lg border border-gray-300 text-gray-700 hover:bg-yellow-50 hover:border-yellow-400 transition-all"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-yellow-50 hover:border-yellow-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
}