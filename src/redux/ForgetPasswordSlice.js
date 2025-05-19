import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  email: "",
};

export const sendEmail = createAsyncThunk("forgetPassword", async (email) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_KEY}api/v1/forgetPassword`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      }
    );
    const data = await response.json();
    console.log("JSON: ", data);
    console.log("response: ", response);
  } catch (error) {
    console.log(error);
  }
});

export const ForgetPasswordSlice = createSlice({
  name: "ForgetPassword",
  initialState,
  reducers: {
    setEmail: (state, action) => {
      console.log("payload from reducer: ", action.payload);
      state.email = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(sendEmail.fulfilled, (state, action) => {
      state.email = action.payload;
    });
    builder.addCase(sendEmail.rejected, (state) => {
      state.email = null;
    });
  },
});

export const { setEmail } = ForgetPasswordSlice.actions;

export default ForgetPasswordSlice.reducer;
