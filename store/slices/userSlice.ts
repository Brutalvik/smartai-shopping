// store/slices/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  email: string;
  name: string;
  role: string;
  isVerified: boolean;
  preferredLocale: string;
  sessionToken: string;
}

const initialState: UserState = {
  email: "",
  name: "",
  role: "user",
  isVerified: false,
  preferredLocale: "en-US",
  sessionToken: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<Partial<UserState>>) {
      return { ...state, ...action.payload };
    },
    clearUser() {
      return initialState;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
