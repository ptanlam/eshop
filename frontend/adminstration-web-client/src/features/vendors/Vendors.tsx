import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import queryString from "query-string";
import PaginationNumberedList from "../../components/pagination/PaginationNumberedList";
import VendorActivaion from "../../components/form/Vendor/VendorActivaion";
import { Utilities } from "../../helpers/utils";
import { getAllVendors } from "./vendorsThunk";
import VendorsSkeleton from "./VendorsSkeleton";

const TableHeader = () => {
  return (
    <thead className="bg-blue-50 dark:bg-green-50 transition duration-150">
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

const Vendors: React.FC = () => {
  const dispatch = useAppDispatch();
  const fetchingVendor = useAppSelector(
    (state) => state.vendors.fetchingVendor
  );
  const vendors = useAppSelector((state) => state.vendors.vendors);
  const totalVendors = useAppSelector(
    (state) => state.vendors.pagination.total
  );

  const history = useHistory();
  const { search } = useLocation();
  let paginationQuery = queryString.parse(search);
  const limit = paginationQuery.limit ? +paginationQuery.limit : 0;
  const offset = paginationQuery.offset ? +paginationQuery.offset : 0;

  const [selectedVendorId, setSelectedVendorId] = useState<string>("");
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  useEffect(() => {
    dispatch(getAllVendors(0));
  }, []);

  const handleOpenDialog = () => {
    setOpenDialog(!openDialog);
  };

  const paginate = (pageNumber: number) => {
    history.push({
      pathname: "/admin/vendors",
      search: `?limit=${limit}&offset=${pageNumber - 1}`,
    });
    dispatch(getAllVendors(pageNumber - 1));
  };

  return (
    <main className="main-each-page">
      {fetchingVendor ? (
        <VendorsSkeleton n={limit} />
      ) : (
        <>
          <table className="w-full divide-y divide-gray-200 round shadow-md animate-fade-in-down ml-auto md:ml-0 overflow-x-scroll md:overflow-x-hidden">
            <TableHeader />
            <tbody className="bg-white divide-y divide-gray-200">
              {vendors.map((vendor) => (
                <tr key={vendor.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col justify-center items-start">
                      <h4 className="text-sm font-medium text-gray-900">
                        {vendor.name}
                      </h4>
                      <p className="text-sm text-gray-500">{vendor.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-500">{vendor.hotline}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {Utilities.convertDateString(vendor.registeredAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full  ${
                        vendor.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {vendor.isActive ? "Activated" : "Inactivated"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <button
                      className={`${
                        vendor.isActive
                          ? "cursor-not-allowed bg-gray-500 dark:bg-gray-500"
                          : "bg-blue-600 dark:bg-green-600"
                      } text-white py-2 px-4 rounded hover:shadow-md transition-all duration-150 outline-none`}
                      onClick={() => {
                        setSelectedVendorId(vendor.id);
                        handleOpenDialog();
                      }}
                      disabled={vendor.isActive}
                    >
                      Activate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <PaginationNumberedList
            totalArray={totalVendors}
            arrayPerPage={limit}
            currentPage={offset}
            paginate={paginate}
          />
        </>
      )}

      <VendorActivaion
        openDialog={openDialog}
        selectedVendorId={selectedVendorId}
        handleOpenDialog={handleOpenDialog}
      />
    </main>
  );
};

export default Vendors;
