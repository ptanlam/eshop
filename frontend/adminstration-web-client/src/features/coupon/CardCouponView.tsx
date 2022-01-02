import React from "react";
import { Utilities } from "../../helpers/utils";
import { Coupon } from "../../models";

interface CardCouponViewProps {
  coupon: Coupon;
  handleDeleteCoupon: (coupon: Coupon) => void;
  handleEditCoupon: (coupon: Coupon) => void;
  handleUpdateStatusCoupon: (id: string | undefined) => void;
}

const CardCouponView: React.FC<CardCouponViewProps> = ({
  coupon,
  handleDeleteCoupon,
  handleEditCoupon,
  handleUpdateStatusCoupon,
}) => {
  const {
    id,
    isActive,
    description,
    code,
    couponName,
    couponType,
    modifier,
    amount,
    unit,
    usage,
    limit,
    pointToAchieve,
    startTime,
    endTime,
    images,
  } = coupon;

  const blurComponent = isActive && "filter blur-xs";

  return (
    <div className="rounded animate-fade-in-down">
      <img
        src={images && images[0].url}
        alt="random imgee"
        className="w-full object-cover object-center rounded-lg shadow-md"
      />

      <div className="relative px-2 -mt-28">
        <div
          className={`bg-white p-4 rounded-lg shadow-lg transition duration-200 ease-in-out`}
        >
          {/* Code - Start Time - End Time */}
          <div
            className={`"w-full flex justify-between items-center ${blurComponent}`}
          >
            <p className="text-xs sm:text-sm text-gray-400">Code: {code}</p>
            <p className="flex-shrink-0 text-xs uppercase text-gray-700">
              {Utilities.convertDateString(startTime)} -{" "}
              {Utilities.convertDateString(endTime)}
            </p>
          </div>
          {/* Amount - Modifier */}
          <h4
            className={`${blurComponent} mt-1 text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold uppercase truncate text-blue-600 dark:text-green-500`}
          >
            {couponType === "cash"
              ? Utilities.convertToCurrency(amount)
              : modifier}
            <span className="uppercase text-lg text-gray-500 ml-1 dark:text-gray-500">
              {couponType === "cash" ? unit : "%"}
            </span>
          </h4>
          {/* Coupon Name - Point to Achieve */}
          <div
            className={`${blurComponent} flex justify-between items-center mt-2`}
          >
            <p className="flex-1 text-xs lg:text-base truncate">{couponName}</p>
            <p className="flex-shrink-0 text-xs lg:text-base ml-5 text-gray-400">
              Point: {pointToAchieve}
            </p>
          </div>
          {/* Description */}
          <p
            className={`${blurComponent} py-2 truncate text-base md:text-lg lg:text-xl xl:text-2xl text-blue-800 dark:text-green-800`}
          >
            {description}
          </p>
          {/* Limit */}
          <div className={`${blurComponent}`}>
            {limit === 0 ? (
              <div className="flex justify-start items-center text-xs text-blue-700 dark:text-green-400 lg:text-base ">
                <svg
                  className="h-3 w-3 md:h-5 md:w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="ml-1 md:ml-2 text-xs md:text-sm lg:text-base">
                  Unlimited usage
                </span>
              </div>
            ) : (
              <p className="text-xs md:text-sm lg:text-base text-blue-700 dark:text-green-400 ">
                {usage}/{limit} card been used
              </p>
            )}
          </div>
          {/* Enable - Edit Button - Delete Button */}
          <div className="relative flex justify-between items-center mt-3 w-full">
            <button
              className={`btn-coupon-card px-3 py-1 ${
                isActive
                  ? "text-white bg-blue-500 dark:bg-green-500"
                  : "hover:bg-blue-500 text-blue-500 border border-blue-500 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-500 dark:hover:text-white"
              }`}
              onClick={() => handleUpdateStatusCoupon(id)}
            >
              {isActive ? "Enable" : "Disable"}
            </button>
            <div className="flex">
              <button
                className={`btn-coupon-card ${
                  isActive
                    ? "hover:bg-gray-500 cursor-not-allowed"
                    : "hover:bg-yellow-500"
                }`}
                disabled={isActive}
                onClick={() => handleEditCoupon(coupon)}
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button
                className={`btn-coupon-card ${
                  isActive
                    ? "hover:bg-gray-500 cursor-not-allowed"
                    : "hover:bg-red-500"
                }`}
                onClick={() => handleDeleteCoupon(coupon)}
                disabled={isActive}
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardCouponView;
