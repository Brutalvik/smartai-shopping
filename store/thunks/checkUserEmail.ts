// store/thunks/checkUserEmail.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const checkUserEmailThunk = createAsyncThunk(
  "auth/checkUserEmail",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://4msbvhshz0.execute-api.us-east-2.amazonaws.com/users/check",
        { email },
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ error: "Network or server error" });
    }
  }
);
