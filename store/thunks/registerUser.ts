import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
interface RegisterPayload {
  email: string;
  name: string;
  password: string;
  preferred_locale?: string;
}

interface RegisterResponse {
  id: string;
  email: string;
  name: string;
  preferred_locale?: string;
}

export const registerUserThunk = createAsyncThunk<
  RegisterResponse,
  RegisterPayload,
  { rejectValue: string }
>("user/register", async (payload, { rejectWithValue }) => {
  console.log(payload);
  try {
    const response = await axios.post(
      "https://4msbvhshz0.execute-api.us-east-2.amazonaws.com/users/register",
      payload
    );

    if (response.status === 201) {
      return {
        id: uuidv4(),
        email: response.data.email,
        name: response.data.name,
        preferred_locale: response.data.preferred_locale,
      };
    } else {
      return rejectWithValue("Unexpected server response.");
    }
  } catch (err: any) {
    const message =
      err.response?.data?.error || err.message || "Registration failed.";
    return rejectWithValue(message);
  }
});
