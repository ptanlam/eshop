import React from "react";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../../app/hooks";
import { activateVendorById } from "../../../features/vendors/vendorsThunk";

export interface Props {
  openDialog: boolean;
  selectedVendorId: string;
  handleOpenDialog: () => void;
}

const VendorActivaion: React.FC<Props> = ({
  openDialog,
  selectedVendorId,
  handleOpenDialog,
}) => {
  const dispatch = useAppDispatch();

  const handleVendorActivation = async () => {
    try {
      dispatch(activateVendorById(selectedVendorId));
      toast.success("Succeed");
    } catch (error) {
      toast.error(error as Error);
    } finally {
      handleOpenDialog();
    }
  };

  return (
    <div
      className={`overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center ${
        openDialog
          ? "backdrop-filter backdrop-blur-sm flex animate-fade-in-down"
          : "hidden"
      }`}
    >
      <div className="relative my-6 mx-auto max-w-3xl w-1/3">
        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
          <h3 className="text-xl md:text-2xl font-semibold p-5">
            Confirm activation for this vendor
          </h3>
          <h3 className="text-base md:text-lg  p-5">Are you sure ?</h3>
          <div className="border-0 rounded-lg shadow-lg relative w-full bg-white outline-none focus:outline-none">
            <div className="flex items-center justify-end p-6">
              <button
                className="bg-transparent text-gray-500 font-bold uppercase text-xs px-3 py-2 hover:shadow-md outline-none ease-linear transition-all duration-150 dark:bg-gray-50"
                type="button"
                onClick={handleOpenDialog}
              >
                Close
              </button>
              <button
                className="bg-blue-500 font-bold uppercase text-sm px-4 py-2 ml-2 rounded shadow hover:shadow-md outline-none ease-linear transition-all duration-150 text-white dark:bg-white dark:text-green-500 dark:hover:text-green-600"
                type="button"
                onClick={handleVendorActivation}
              >
                Activate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorActivaion;
