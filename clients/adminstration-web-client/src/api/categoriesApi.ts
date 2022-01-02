import { Category, ChilrenCategory } from "../models";
import axiosClient from "./axiosClient";

const url = "/categories";

const categoriesApi = {
  getAllCategories() {
    return axiosClient.get<string, Category[]>(url);
  },
  addParent(data: FormData) {
    return axiosClient.post<string, Category>(url, data);
  },
  addChild(data: FormData) {
    return axiosClient.post<string, ChilrenCategory>(url, data);
  },
};

export default categoriesApi;
