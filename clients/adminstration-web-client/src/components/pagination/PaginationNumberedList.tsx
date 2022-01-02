import React from "react";

interface PaginationNumberedListProps {
  arrayPerPage: number;
  totalArray: number;
  currentPage: number;
  paginate: (number: number) => void;
}

const PaginationNumberedList: React.FC<PaginationNumberedListProps> = ({
  arrayPerPage,
  totalArray,
  currentPage,
  paginate,
}) => {
  const pageNumbers: number[] = [];
  const totalPagination = totalArray / arrayPerPage;

  for (let i = 1; i <= Math.ceil(totalPagination); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="mt-10">
      <nav className="block">
        <ul className="flex pl-0 rounded list-none flex-wrap">
          <li>
            {pageNumbers.map((number, index) => {
              return (
                <button
                  key={index}
                  className={
                    currentPage + 1 === number
                      ? "border border-blue-300 bg-blue-200 text-white hover:bg-blue-400 px-4 py-2 text-base font-medium dark:text-green-600 dark:border-green-300 dark:bg-green-200 dark:hover:bg-green-400"
                      : "bg-white border-blue-300 text-blue-500 hover:bg-blue-400 hover:text-white inline-flex items-center px-4 py-2 border text-base font-medium dark:border-green-300 dark:text-green-400 dark:bg-green-200 dark:hover:bg-green-400"
                  }
                  type="button"
                  disabled={currentPage + 1 === number}
                  onClick={() => paginate(number)}
                >
                  {number}
                </button>
              );
            })}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default PaginationNumberedList;
