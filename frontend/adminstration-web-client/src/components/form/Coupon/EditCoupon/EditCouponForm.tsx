import React, { useState } from "react";
import { Coupon } from "../../../../models";
import ButtonsAction from "../../../common/ButtonsAction";
import VerticalCurrenciesSelect from "../../../common/VerticalCurrenciesSelect";
import VerticalDateTimeInput from "../../../common/VerticalDateTimeInput";
import VerticalImageInput from "../../../common/VerticalImageInput";
import VerticalLabelInput from "../../../common/VerticalLabelInput";
import VerticalTextareaInput from "../../../common/VerticalTextareaInput";

interface EditCouponFormProps {
  coupon: Coupon | undefined;
  isUnlimited: boolean;
  reset: any;
  errors: any;
  onSubmit: () => void;
  register: any;
  handleChangeUnlimited: () => void;
  handleOpenEditCouponForm: () => void;
}

const EditCouponForm: React.FC<EditCouponFormProps> = ({
  coupon,
  isUnlimited,
  reset,
  errors,
  onSubmit,
  register,
  handleChangeUnlimited,
  handleOpenEditCouponForm,
}) => {
  return (
    <form className="grid grid-cols-6 gap-3 p-6" onSubmit={onSubmit}>
      <VerticalLabelInput
        cols={6}
        label="Coupon Name"
        inputName="couponName"
        type="text"
        register={register}
        errors={errors}
      />

      <div className="col-span-3">
        <p className="block text-sm sm:text-base font-medium text-gray-700 mb-4">
          Limit of coupon
        </p>
        <button
          className={`${
            isUnlimited
              ? "bg-blue-400 text-white dark:bg-green-400"
              : "bg-white text-blue-400 dark:text-green-400"
          } py-2 px-3 rounded transition duration-150`}
          type="button"
          onClick={handleChangeUnlimited}
        >
          Unlimited
        </button>
        <button
          className={`${
            !isUnlimited
              ? "bg-blue-400 text-white dark:bg-green-400"
              : "bg-white text-blue-400 dark:text-green-400"
          } py-2 px-3 rounded transition duration-150 ml-2`}
          type="button"
          onClick={handleChangeUnlimited}
        >
          Limited
        </button>
      </div>

      <div className="col-span-3">
        <label
          htmlFor="limit"
          className={
            !isUnlimited
              ? "animate-fade-in-opacity block text-sm sm:text-base font-medium text-gray-700"
              : "hidden"
          }
        >
          Total number of coupons
        </label>
        {!isUnlimited && (
          <input
            type="number"
            id="limit"
            min="1"
            defaultValue={1}
            className={`${
              !isUnlimited ? "animate-fade-in-opacity" : "hidden"
            } mt-2 p-3 block w-full shadow-sm sm:text-sm border border-gray-500 rounded-md`}
            {...register("limit")}
          />
        )}
        {!isUnlimited && errors.limit && (
          <p className="text-red-500">{errors.limit.message}</p>
        )}
      </div>

      <VerticalTextareaInput
        cols={6}
        inputName="description"
        label="Description"
        register={register}
        errors={errors}
      />

      <p className="col-span-6 text-base md:text-lg font-semibold ">
        Coupon Details
      </p>

      <VerticalLabelInput
        cols={6}
        label="Point to achieve"
        inputName="pointToAchieve"
        type="number"
        register={register}
        errors={errors}
      />

      <ButtonsAction
        cols={6}
        title="Update"
        handleAction={() => {
          handleOpenEditCouponForm();
          reset();
        }}
      />
    </form>
  );
};

export default EditCouponForm;
