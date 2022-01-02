import React from "react";

interface CategorySkeletonProps {
  n: number;
}

const CategorySkeleton: React.FC<CategorySkeletonProps> = ({ n }) => {
  return (
    <>
      {[...new Array(n)].map((_, index) => (
        <div
          key={index}
          className="animate-pulse flex justify-around items-center h-12 w-30 bg-gray-50 mt-2 rounded-3xl"
        >
          <div className="loader animate-spinner border-gray-200 rounded-full border-4 border-t-4 h-8 w-8"></div>
        </div>
      ))}
    </>
  );
};

export default CategorySkeleton;
