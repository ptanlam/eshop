import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useAppDispatch } from "../../../../app/hooks";
import { updateCouponInformation } from "../../../../features/coupon/couponsThunk";
import { Utilities } from "../../../../helpers/utils";
import { Coupon } from "../../../../models";
import EditCouponForm from "./EditCouponForm";

type FormValues = {
  couponName: string;
  description: string;
  modifier: number;
  amount: number;
  unit: string;
  limit: number;
  pointToAchieve: number;
  startTime: Date | string;
  endTime: Date | string;
  files: File | FileList;
};

interface EditCouponManagementProps {
  coupon: Coupon | undefined;
  openEditCouponForm: boolean;
  handleOpenEditCouponForm: () => void;
}

const EditCouponFormSchema = yup.object({
  couponName: yup.string().required("This field is required"),
  description: yup
    .string()
    .min(1, "Please enter more than 1 character")
    .required("This field is required"),
  limit: yup
    .number()
    .typeError("You must specify a number")
    .positive()
    .integer("Must be a number"),
  pointToAchieve: yup
    .number()
    .typeError("You must specify a number")
    .positive()
    .integer("Must be a number")
    .min(1, "Minimum point is 1")
    .max(1000, "Maximum point is 1000")
    .required("This field is required"),
});

const EnhancedEditCouponHeading: React.FC<{
  handleOpenEditCouponForm: () => void;
}> = ({ handleOpenEditCouponForm }) => {
  return (
    <div className="flex justify-between">
      <h3 className="text-xl md:text-2xl font-semibold pl-5 pt-5">
        Edit Coupon Form
      </h3>
      <button
        className="px-5 pt-5"
        type="button"
        onClick={handleOpenEditCouponForm}
      >
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

const EditCouponManagement: React.FC<EditCouponManagementProps> = ({
  coupon,
  openEditCouponForm,
  handleOpenEditCouponForm,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(EditCouponFormSchema),
  });
  const dispatch = useAppDispatch();
  const [isUnlimited, setIsUnlimited] = useState(true);

  const handleChangeUnlimited = () => {
    setIsUnlimited(!isUnlimited);
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      await dispatch(
        updateCouponInformation({
          id: coupon?.id,
          data: Utilities.updateCouponInformation(isUnlimited, coupon, data),
        })
      );
      reset();
      toast.success("Update succeed!");
    } catch (error) {
      toast.error(error as Error);
    } finally {
      handleOpenEditCouponForm();
    }
  });

  return (
    <div
      className={`overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center ${
        openEditCouponForm
          ? "backdrop-filter backdrop-blur-sm flex animate-fade-in-down"
          : "hidden"
      }`}
    >
      <div className="fixed left-1/2 top-0 transform -translate-x-1/2 w-1/2 rounded-lg shadow-lg flex flex-col bg-white">
        <EnhancedEditCouponHeading
          handleOpenEditCouponForm={handleOpenEditCouponForm}
        />
        <EditCouponForm
          isUnlimited={isUnlimited}
          coupon={coupon}
          reset={reset}
          register={register}
          errors={errors}
          onSubmit={onSubmit}
          handleChangeUnlimited={handleChangeUnlimited}
          handleOpenEditCouponForm={handleOpenEditCouponForm}
        />
      </div>
    </div>
  );
};

export default EditCouponManagement;
