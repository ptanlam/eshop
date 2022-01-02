import { Vendor } from "../models";
import axiosClient from "./axiosClient";

const vendorsApi = {
  getAllVendors(offset: number) {
    return axiosClient.get<string, { data: Vendor[]; pagination: any }>(
      `/vendors?limit=8&offset=${offset}`
    );
  },
};

export default vendorsApi;
