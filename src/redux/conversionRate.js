import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  conversionRate: 1,
};

export const fetchConversionRate = createAsyncThunk(
  "getConversionRate",
  async (currency) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/currency/conversion-rate/${currency}`
      );
      const data = await response.json();
      return data.data;
    } catch (error) {
      throw error;
    }
  }
);

export const conversionRateSlice = createSlice({
  name: "conversionRate",
  initialState,
  reducers: {
    changeConversionRate: (state, action) => {
      state.conversionRate = action.payload.conversionRate;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchConversionRate.pending, (state) => {
      state.conversionRate = null;
    });
    builder.addCase(fetchConversionRate.fulfilled, (state, action) => {
      state.conversionRate = action.payload;
    });
    builder.addCase(fetchConversionRate.rejected, (state) => {
      state.conversionRate = 1;
    });
  },
});

// Action creators are generated for each case reducer function
export const { changeConversionRate } = conversionRateSlice.actions;

export default conversionRateSlice.reducer;
