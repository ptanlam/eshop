import React from "react";

interface CouponsSkeletonProps {
  n: number;
}

const CouponsSkeleton: React.FC<CouponsSkeletonProps> = ({ n }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 animate-pulse">
      {[...new Array(n)].map((_, index) => (
        <div
          key={index}
          className="border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto dark:border-green-300"
        >
          <div className="animate-pulse flex space-x-4 h-60">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-24 bg-blue-400 rounded dark:bg-green-400"></div>
              <div className="w-full flex justify-between">
                <div className="h-4 bg-blue-400 rounded w-1/3 dark:bg-green-400"></div>
                <div className="h-4 bg-blue-400 rounded w-1/3 dark:bg-green-400"></div>
              </div>
              <div className="h-8 bg-blue-400 rounded w-1/2 dark:bg-green-400"></div>
              <div className="w-full flex justify-between">
                <div className="h-4 bg-blue-400 rounded w-3/5 dark:bg-green-400"></div>
                <div className="h-4 bg-blue-400 rounded w-1/3 dark:bg-green-400"></div>
              </div>
              <div className="w-full flex justify-between">
                <div className="h-4 bg-blue-400 rounded w-1/2 dark:bg-green-400"></div>
                <div className="h-4 bg-blue-400 rounded w-1/5 dark:bg-green-400"></div>
                <div className="h-4 bg-blue-400 rounded w-1/5 dark:bg-green-400"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CouponsSkeleton;
