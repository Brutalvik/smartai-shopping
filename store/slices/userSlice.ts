// store/slices/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserState } from "@/types/store";

const initialState: UserState = {
  id: "",
  sub: "",
  email: "",
  name: "",
  phone: "",
  group: "",
  given_name: "",
  family_name: "",
  business_name: "",
  preferredLocale: "",
  accessTokenExpiresAt: undefined,
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
