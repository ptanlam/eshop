import { createAsyncThunk } from "@reduxjs/toolkit";
import categoriesApi from "../../api/categoriesApi";

export const getAllCategories = createAsyncThunk(
  "categories/getAllCategories",
  async () => {
    const categories = await categoriesApi.getAllCategories();
    return categories;
  }
);

export const addParentCategory = createAsyncThunk(
  "categories/addParent",
  async (data: FormData) => {
    const parentCategory = await categoriesApi.addParent(data);
    console.log(parentCategory);
    return parentCategory;
  }
);

export const addChildCategory = createAsyncThunk(
  "categories/addChild",
  async (data: FormData) => {
    const childCategory = await categoriesApi.addChild(data);
    console.log(childCategory);
    return childCategory;
  }
);
