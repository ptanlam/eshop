import React from "react";

interface VerticalCouponSelectTypeProps {
  cols: number;
  label: string;
  inputName: string;
  handleChangeCouponAttribute: (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => void;
}

const VerticalCouponSelectType: React.FC<VerticalCouponSelectTypeProps> = ({
  cols,
  label,
  inputName,
  handleChangeCouponAttribute,
}) => {
  return (
    <div className={`col-span-${cols}`}>
      <label className="block text-sm sm:text-base font-medium text-gray-700">
        {label}
      </label>
      <select
        className="mt-2 py-2.5 px-1 block w-full shadow-sm sm:text-sm border border-gray-500 rounded-md capitalize"
        name={inputName}
        id={inputName}
        onChange={handleChangeCouponAttribute}
      >
        {["percentage", "cash"].map((t, index) => (
          <option key={index} value={t}>
            {t}
          </option>
        ))}
      </select>
    </div>
  );
};

export default VerticalCouponSelectType;
