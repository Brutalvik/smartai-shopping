// store/slices/authSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { checkUserEmailThunk } from "@/store/thunks/checkUserEmail";

interface AuthState {
  email: string;
  exists: boolean | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  email: "",
  exists: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkUserEmailThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkUserEmailThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.email = action.meta.arg;
        state.exists = action.payload.exists;
      })
      .addCase(checkUserEmailThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to check user email";
      });
  },
});

export default authSlice.reducer;
