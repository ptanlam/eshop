import React from "react";

interface VendorsSkeletonProps {
  n: number;
}

const VendorsSkeletonHead = () => {
  return (
    <thead className="bg-gray-50 transition duration-150">
      <tr>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Name
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Hotline
        </th>

        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Join in
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Status
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          <span className="sr-only">Edit</span>
        </th>
      </tr>
    </thead>
  );
};

const VendorsSkeletonBody = () => {
  return (
    <tr className="bg-gray-200 animate-pulse">
      <td className="px-6 py-4">
        <div className="space-y-2">
          <div className="bg-gray-100 h-4 w-60 rounded"></div>
          <div className="bg-gray-100 h-4 w-28 rounded"></div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="bg-gray-100 h-4 w-48 rounded"></div>
      </td>
      <td className="px-6 py-4">
        <div className="bg-gray-100 h-4 w-32 rounded"></div>
      </td>
      <td className="px-6 py-4">
        <div className="bg-gray-100 h-4 w-32 rounded"></div>
      </td>
      <td className="px-6 py-4">
        <div className="bg-gray-100 h-4 w-10 rounded"></div>
      </td>
    </tr>
  );
};

const VendorsSkeleton: React.FC<VendorsSkeletonProps> = ({ n }) => {
  return (
    <table className="w-full divide-y divide-gray-200 round">
      <VendorsSkeletonHead />
      <tbody className="bg-white divide-y divide-gray-100">
        {[...new Array(n)].map((_, index) => (
          <VendorsSkeletonBody key={index} />
        ))}
      </tbody>
    </table>
  );
};

export default VendorsSkeleton;
