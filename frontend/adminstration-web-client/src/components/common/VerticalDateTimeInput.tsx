import React from "react";
import { Utilities } from "../../helpers/utils";

interface VerticalDateTimeInputProps {
  cols: number;
  label: string;
  inputName: string;
  defaultValue?: Date | string;
  register: any;
  errors: any;
  handleChangeCouponAttribute?: (e: any) => void;
}

const VerticalDateTimeInput: React.FC<VerticalDateTimeInputProps> = ({
  cols,
  label,
  inputName,
  register,
  errors,
  defaultValue,
}) => {
  return (
    <div className={`col-span-${cols}`}>
      <label
        htmlFor={inputName}
        className="block text-sm sm:text-base font-medium text-gray-700"
      >
        {label}
      </label>
      <input
        type="date"
        id={inputName}
        name={inputName}
        defaultValue={defaultValue}
        min={Utilities.disablePastDay()}
        className="mt-2 p-3 w-full shadow-sm text-sm sm:text-base border border-gray-500 rounded-md"
        {...register(`${inputName}`)}
      />
      {errors?.[inputName] && (
        <p className="text-red-500">{errors?.[inputName].message}</p>
      )}
    </div>
  );
};

export default VerticalDateTimeInput;
