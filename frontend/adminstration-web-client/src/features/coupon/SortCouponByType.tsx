import React, { useState } from "react";
import { useHistory } from "react-router";
import { typesOfCoupon } from "../../constant";

interface SortCouponByTypeProps {}

const SortCouponByType: React.FC<SortCouponByTypeProps> = () => {
  const history = useHistory();

  const [openDropdown, setOpenDropdown] = useState<boolean>(false);

  const handleOpenDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  function handleChangeType(couponType: string) {
    setOpenDropdown(false);

    if (couponType === "all")
      return history.push({
        pathname: "/admin/coupons",
        search: `?limit=6&offset=0`,
      });

    history.push({
      pathname: "/admin/coupons",
      search: `?limit=6&offset=0&couponType=${couponType}`,
    });
  }
  return (
    <div className="relative ml-3">
      <button
        className="text-blue-500 text-xs md:text-base font-bold dark:text-green-500"
        type="button"
        onClick={handleOpenDropdown}
      >
        Sort by
      </button>
      <div
        className={`${
          openDropdown ? "block" : "hidden"
        } bg-white absolute animate-fade-in-down text-base top-8 z-50 py-2 list-none text-left rounded shadow-lg`}
      >
        {typesOfCoupon.map((type, index) => (
          <p
            key={index}
            className="cursor-pointer capitalize text-sm md:text-base py-2 px-4 block w-full whitespace-nowrap bg-transparent text-gray-700 hover:bg-gray-100"
            onClick={() => handleChangeType(type)}
          >
            {type}
          </p>
        ))}
      </div>
    </div>
  );
};

export default SortCouponByType;
