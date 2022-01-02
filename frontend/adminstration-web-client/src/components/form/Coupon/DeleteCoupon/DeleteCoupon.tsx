import queryString from "query-string";
import React from "react";
import { useLocation } from "react-router";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../../../app/hooks";
import {
  deleteCouponById,
  getAllCoupons,
} from "../../../../features/coupon/couponsThunk";
import { Coupon } from "../../../../models";

interface DeleteCouponProps {
  fetchingCoupons: boolean;
  coupon: Coupon | undefined;
  openDialog: boolean;
  handleOpenDeleteCouponForm: () => void;
}

const DeleteCoupon: React.FC<DeleteCouponProps> = ({
  fetchingCoupons,
  coupon,
  openDialog,
  handleOpenDeleteCouponForm,
}) => {
  const dispatch = useAppDispatch();
  const { search } = useLocation();
  let paginationQuery = queryString.parse(search);
  const offset = paginationQuery.offset ? +paginationQuery.offset : 0;

  async function deleteCoupon(id: string) {
    try {
      await dispatch(deleteCouponById(id));
      await dispatch(getAllCoupons(offset));
      toast.success("Coupon deleted");
    } catch (error) {
      toast.error(error as Error);
    } finally {
      handleOpenDeleteCouponForm();
    }
  }

  return (
    <div
      className={`overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center ${
        openDialog
          ? "backdrop-filter backdrop-blur-sm flex animate-fade-in-down"
          : "hidden"
      }`}
    >
      <div className="relative my-6 mx-auto max-w-3xl w-1/3">
        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
          <h3 className="text-xl md:text-2xl font-semibold p-5">
            Delete this coupon
          </h3>
          <h3 className="text-base md:text-lg  p-5">Are you sure ?</h3>
          <div className="border-0 rounded-lg shadow-lg relative w-full bg-white outline-none focus:outline-none">
            <div className="flex items-center justify-end p-6">
              <button
                className={`${
                  fetchingCoupons ? "cursor-not-allowed" : "hover:shadow-md"
                } bg-transparent text-gray-500 font-bold uppercase text-xs px-3 py-2 outline-none ease-linear transition-all duration-150 dark:bg-gray-50`}
                type="button"
                disabled={fetchingCoupons}
                onClick={handleOpenDeleteCouponForm}
              >
                Close
              </button>
              <button
                className={`${
                  fetchingCoupons
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-blue-500 shadow hover:shadow-md dark:bg-white dark:text-green-500 dark:hover:text-green-600"
                } font-bold uppercase text-sm px-4 py-2 ml-2 rounded outline-none ease-linear transition-all duration-150 text-white`}
                type="button"
                disabled={fetchingCoupons}
                onClick={() => deleteCoupon(coupon?.id as string)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteCoupon;
