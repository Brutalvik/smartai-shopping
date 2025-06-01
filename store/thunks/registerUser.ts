// store/thunks/registerUser.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setUser } from "@/store/slices/userSlice";

interface RegisterPayload {
  email: string;
  name: string;
  preferred_locale?: string;
}

export const registerUserThunk = createAsyncThunk<
  void,
  RegisterPayload,
  { rejectValue: string }
>("user/register", async (payload, { dispatch, rejectWithValue }) => {
  try {
    const response = await axios.post(
      "https://4msbvhshz0.execute-api.us-east-2.amazonaws.com/users/register",
      payload
    );

    if (response.status === 201) {
      dispatch(setUser({ ...payload }));
    } else {
      return rejectWithValue("Unexpected server response.");
    }
  } catch (err: any) {
    const message =
      err.response?.data?.error || err.message || "Registration failed.";
    return rejectWithValue(message);
  }
});
