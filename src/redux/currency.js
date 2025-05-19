import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currency: "OMR",
};

export const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    changeCurrency: (state, action) => {
      state.currency = action.payload.currency;
    },
  },
});

// Action creators are generated for each case reducer function
export const { changeCurrency } = currencySlice.actions;

export default currencySlice.reducer;
