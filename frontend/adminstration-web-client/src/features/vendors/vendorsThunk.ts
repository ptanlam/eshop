import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";
import vendorsApi from "../../api/vendorsApi";
import { Vendor } from "../../models";

export const getAllVendors = createAsyncThunk(
  "vendors/getAllVendors",
  async (offset: number) => {
    const response = await vendorsApi.getAllVendors(offset);
    return { ...response };
  }
);

export const activateVendorById = createAsyncThunk(
  "vendors/activateVendorById",
  async (id: string) => {
    const activatedVendor = await axiosClient.patch<any, Vendor>(
      `/vendors/${id}`,
      {
        active: true,
      }
    );
    return activatedVendor;
  }
);
