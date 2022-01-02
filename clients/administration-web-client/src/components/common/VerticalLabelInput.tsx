import React from "react";

interface VerticalLabelInputProps {
  cols: number;
  colsResponsive?: number;
  label: string;
  inputName: string;
  type: string;
  register: any;
  errors: any;
  defaultValue?: string | number;
}

const VerticalLabelInput: React.FC<VerticalLabelInputProps> = ({
  colsResponsive,
  cols,
  label,
  inputName,
  type,
  defaultValue,
  register,
  errors,
}) => {
  return (
    <div
      className={`col-span-${cols} lg:col-span-${colsResponsive} animate-fade-in-down`}
    >
      <label
        htmlFor={inputName}
        className="block text-sm sm:text-base font-medium text-gray-700"
      >
        {label}
      </label>
      <input
        id={inputName}
        className="mt-2 p-2 block w-full shadow-sm text-sm sm:text-base border border-gray-500 rounded-md animate-fade-in-down"
        type={type}
        min="0"
        defaultValue={defaultValue}
        {...register(`${inputName}`)}
      />
      {errors?.[inputName] && (
        <p className="text-red-500">{errors?.[inputName].message}</p>
      )}
    </div>
  );
};

export default VerticalLabelInput;
