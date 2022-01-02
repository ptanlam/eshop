import React from "react";
import { mockCurrencies } from "../../db/mockCurrencies";

interface VerticalCurrenciesSelectProps {
  inputName: string;
  type: string;
  label: string;
  register: any;
  errors: any;
  handleChangeCouponAttribute: (e: any) => void;
}

const VerticalCurrenciesSelect: React.FC<VerticalCurrenciesSelectProps> = ({
  inputName,
  type,
  label,
  register,
  errors,
  handleChangeCouponAttribute,
}) => {
  const isCashType = type === "cash";

  return (
    <>
      <label
        htmlFor={inputName}
        className="block text-sm sm:text-base font-medium text-gray-700 animate-fade-in-down"
      >
        {label}
      </label>
      <div className="grid grid-cols-4">
        {isCashType && (
          <input
            className="col-span-3 mt-2 p-2.5 block w-full shadow-sm sm:text-sm border border-gray-500 rounded-md animate-fade-in-down"
            name="amount"
            id="amount"
            type="number"
            {...register("amount")}
          />
        )}
        <select
          className="col-span-1 mt-2 ml-2 py-2.5 px-1 block w-full shadow-sm sm:text-sm border border-gray-500 rounded-md animate-fade-in-down"
          name={inputName}
          id={inputName}
          onChange={handleChangeCouponAttribute}
        >
          {mockCurrencies.map((c, index) => (
            <option key={index} value={c}>
              {c}
            </option>
          ))}
        </select>
        {isCashType && errors.amount && (
          <p className="col-span-4 text-red-500">{errors.amount.message}</p>
        )}
      </div>
    </>
  );
};

export default VerticalCurrenciesSelect;
