import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const CustomerPagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  // Garantir que os valores são números válidos
  const safeCurrentPage = Math.max(1, Number(currentPage) || 1);
  const safeTotalPages = Math.max(1, Number(totalPages) || 1);
  const safeTotalItems = Math.max(0, Number(totalItems) || 0);
  const safeItemsPerPage = Math.max(1, Number(itemsPerPage) || 10);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, safeCurrentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(safeTotalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  // Se não houver itens ou apenas uma página, não mostra a paginação
  if (safeTotalItems <= 0 || safeTotalPages <= 1) {
    return null;
  }

  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <div className="flex-1 flex justify-between items-center">
        <p className="text-sm text-gray-700">
          Mostrando{' '}
          <span className="font-medium">
            {((safeCurrentPage - 1) * safeItemsPerPage) + 1}
          </span>{' '}
          até{' '}
          <span className="font-medium">
            {Math.min(safeCurrentPage * safeItemsPerPage, safeTotalItems)}
          </span>{' '}
          de{' '}
          <span className="font-medium">{safeTotalItems}</span> resultados
        </p>
        <div className="flex justify-end mt-4">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              onClick={() => onPageChange(safeCurrentPage - 1)}
              disabled={safeCurrentPage <= 1}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                safeCurrentPage <= 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              Anterior
            </button>

            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  safeCurrentPage === page
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => onPageChange(safeCurrentPage + 1)}
              disabled={safeCurrentPage >= safeTotalPages}
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                safeCurrentPage >= safeTotalPages
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              Próximo
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default CustomerPagination;