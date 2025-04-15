// app/components/profile/PaginationControl.tsx
'use client';

type PaginationControlProps = {
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  onPageChange: (newPage: number) => void;
  loadMore?: () => void; // Optional for implementing "Load More" functionality
  loadMoreStyle?: boolean; // If true, show as "Load More" button instead of pagination
};

export default function PaginationControl({
  currentPage,
  totalPages,
  isLoading,
  onPageChange,
  loadMore,
  loadMoreStyle = false
}: PaginationControlProps) {
  if (totalPages <= 1) return null;

  // Handler for load more button
  const handleLoadMore = () => {
    if (loadMore) {
      loadMore();
    } else {
      onPageChange(currentPage + 1);
    }
  };

  // Load More style pagination (simple next button)
  if (loadMoreStyle) {
    return (
      <div className="flex justify-center mt-8">
        {currentPage < totalPages ? (
          <button
            onClick={handleLoadMore}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow hover:shadow-lg transition-all duration-300 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </span>
            ) : (
              'Load More'
            )}
          </button>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-sm">All posts displayed</p>
        )}
      </div>
    );
  }

  // Traditional pagination interface
  const renderPageNumbers = () => {
    const pages = [];
    
    // Always show first page
    pages.push(
      <button
        key={1}
        onClick={() => onPageChange(1)}
        className={`w-8 h-8 flex items-center justify-center rounded-full ${
          currentPage === 1 ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
        disabled={isLoading}
      >
        1
      </button>
    );

    // For many pages, use ellipsis approach
    if (totalPages > 7) {
      if (currentPage > 3) {
        pages.push(
          <span key="start-ellipsis" className="px-2">
            ...
          </span>
        );
      }

      // Show current page neighborhood
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`w-8 h-8 flex items-center justify-center rounded-full ${
              currentPage === i ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            disabled={isLoading}
          >
            {i}
          </button>
        );
      }

      if (currentPage < totalPages - 2) {
        pages.push(
          <span key="end-ellipsis" className="px-2">
            ...
          </span>
        );
      }
    } else {
      // For fewer pages, show all page numbers
      for (let i = 2; i < totalPages; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`w-8 h-8 flex items-center justify-center rounded-full ${
              currentPage === i ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            disabled={isLoading}
          >
            {i}
          </button>
        );
      }
    }

    // Always show last page if there are multiple pages
    if (totalPages > 1) {
      pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className={`w-8 h-8 flex items-center justify-center rounded-full ${
            currentPage === totalPages ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          disabled={isLoading}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      {/* Previous page button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className="w-9 h-9 flex items-center justify-center rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </button>
      
      {/* Page number buttons */}
      <div className="flex items-center space-x-1">
        {renderPageNumbers()}
      </div>
      
      {/* Next page button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        className="w-9 h-9 flex items-center justify-center rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}