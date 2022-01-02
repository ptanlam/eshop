import React from "react";
import { Category } from "../../models";

interface SecondDepthProps {
  secondCategory: Category | undefined;
  handleSelectThirdCategory: (id: string) => void;
}

const SecondDepth: React.FC<SecondDepthProps> = ({
  secondCategory,
  handleSelectThirdCategory,
}) => {
  return (
    <div className="category-depth category-second-depth">
      <p className="flex-shrink-0 truncate px-2 text-center font-bold text-xs sm:text-base md:text-lg lg:text-xl dark:text-green-600">
        Second Depth
      </p>
      <div className="flex-1 overflow-x-hidden overflow-y-auto h-screen px-0 sm:px-1 md:px-2 lg:px-3">
        {secondCategory?.children?.map((category) => (
          <div
            key={category.id}
            className="category-card motion-safe:transform-none"
            onClick={() => handleSelectThirdCategory(category.id)}
          >
            <p className="flex-1 truncate">{category.name}</p>
            {category.children && category.children?.length !== 0 && (
              <svg
                className="flex-shrink-0 h-3 w-3 sm:h-4 sm:w-4 md:h-6 md:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecondDepth;
