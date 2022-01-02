import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Vendor } from "../../models";
import { activateVendorById, getAllVendors } from "./vendorsThunk";

export interface VendorsSliceState {
  fetchingVendor: boolean;
  vendors: Vendor[];
  pagination: VendorsPagination;
}

export interface VendorsPagination {
  total: number;
}

const initialState: VendorsSliceState = {
  vendors: [],
  fetchingVendor: false,
  pagination: { total: 0 },
};

export const vendorsSlice = createSlice({
  name: "vendors",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllVendors.pending, (state, action) => {
      state.fetchingVendor = true;
    });

    builder.addCase(
      getAllVendors.fulfilled,
      (
        state,
        action: PayloadAction<{ data: Vendor[]; pagination: VendorsPagination }>
      ) => {
        state.fetchingVendor = false;
        state.vendors = action.payload.data;
        state.pagination.total = action.payload.pagination.total;
      }
    );
    builder.addCase(getAllVendors.rejected, (state, action) => {
      state.fetchingVendor = false;
    });
    builder.addCase(
      activateVendorById.fulfilled,
      (state, action: PayloadAction<Vendor>) => {
        const vendor = state.vendors.findIndex(
          (vendor) => vendor.id === action.payload.id
        );
        state.vendors[vendor].isActive = action.payload.isActive;
      }
    );
  },
});

export default vendorsSlice.reducer;
