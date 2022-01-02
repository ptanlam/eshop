import React from "react";

interface VerticalTextareaInputProps {
  cols: number;
  label: string;
  inputName: string;
  defaultValue?: string;
  register: any;
  errors: any;
}

const VerticalTextareaInput: React.FC<VerticalTextareaInputProps> = ({
  cols,
  label,
  inputName,
  defaultValue,
  register,
  errors,
}) => {
  return (
    <div className={`col-span-${cols}`}>
      <label
        className="block text-sm sm:text-base font-medium text-gray-700"
        htmlFor={inputName}
      >
        {label}
      </label>
      <textarea
        id={inputName}
        className="mt-2 p-3 block w-full text-sm sm:text-base border border-gray-500 rounded-md"
        rows={2}
        cols={10}
        defaultValue={defaultValue}
        {...register(`${inputName}`)}
      />
      {errors?.[inputName] && (
        <p className="text-red-500">{errors?.[inputName].message}</p>
      )}
    </div>
  );
};

export default VerticalTextareaInput;
