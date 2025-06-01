// store/thunks/checkUserEmail.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { CDN } from "@/config/config";

export const checkUserEmailThunk = createAsyncThunk(
  "auth/checkUserEmail",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        CDN.userAuthApi as string,
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
