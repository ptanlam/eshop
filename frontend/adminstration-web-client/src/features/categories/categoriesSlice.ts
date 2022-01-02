import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category, ChilrenCategory } from "../../models";
import {
  addChildCategory,
  addParentCategory,
  getAllCategories,
} from "./categoriesThunk";

export interface CategoriesSliceState {
  categories: Category[];
  fetchingCategories: boolean;
}

export const initialState: CategoriesSliceState = {
  categories: [],
  fetchingCategories: false,
};

export const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllCategories.pending, (state, action) => {
      state.fetchingCategories = true;
    });
    builder.addCase(
      getAllCategories.fulfilled,
      (state, action: PayloadAction<Category[]>) => {
        state.fetchingCategories = false;
        state.categories = action.payload;
      }
    );
    builder.addCase(getAllCategories.rejected, (state, action) => {
      state.fetchingCategories = false;
    });
    builder.addCase(
      addParentCategory.fulfilled,
      (state, action: PayloadAction<Category>) => {
        state.categories = [...state.categories, action.payload];
      }
    );
    builder.addCase(
      addChildCategory.fulfilled,
      (state, action: PayloadAction<ChilrenCategory>) => {
        state.categories.find((category) =>
          category.id === action.payload.parentId
            ? category.children?.push(action.payload)
            : category.children?.find(
                (child) =>
                  child.id === action.payload.parentId &&
                  child.children?.push(action.payload)
              )
        );
      }
    );
  },
});

export default categoriesSlice.reducer;
