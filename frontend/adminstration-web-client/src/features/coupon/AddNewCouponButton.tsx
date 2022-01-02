import React from "react";

interface AddNewCouponButtonProps {
  fetchingCoupons: boolean;
  handleOpenCouponForm: () => void;
}

const AddNewCouponButton: React.FC<AddNewCouponButtonProps> = ({
  fetchingCoupons,
  handleOpenCouponForm,
}) => {
  return (
    <div>
      <button
        type="button"
        className={`${
          fetchingCoupons && "cursor-not-allowed"
        }  py-1.5 px-3 rounded transition duration-150 bg-blue-500 text-sm md:text-base lg:text-lg text-white hover:shadow-md dark:bg-green-500`}
        onClick={handleOpenCouponForm}
        disabled={fetchingCoupons}
      >
        Add new
      </button>
    </div>
  );
};

export default AddNewCouponButton;
