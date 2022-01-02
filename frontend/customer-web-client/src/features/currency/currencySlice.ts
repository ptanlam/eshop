import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface CurrencyState {
  unit: string;
}

const initialState: CurrencyState = {
  unit: localStorage.getItem('unit') || '',
};

const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    setUnit(state, action: PayloadAction<string>) {
      localStorage.setItem('unit', action.payload);
      state.unit = action.payload;
    },
  },
});

export const currencyActions = currencySlice.actions;

const currencyReducer = currencySlice.reducer;
export default currencyReducer;

export const currencyUnitSelector = (state: RootState) => state.currency.unit;
