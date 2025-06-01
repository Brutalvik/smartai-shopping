// store/slices/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  email: string;
  isNewUser: boolean;
  name?: string;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  email: "",
  isNewUser: false,
  name: undefined,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
    markAsNewUser(state) {
      state.isNewUser = true;
    },
    markAsExistingUser(state) {
      state.isNewUser = false;
    },
    authenticateUser(state) {
      state.isAuthenticated = true;
    },
    setUserName(state, action: PayloadAction<string>) {
      state.name = action.payload;
    },
    resetUser(state) {
      state.email = "";
      state.name = undefined;
      state.isNewUser = false;
      state.isAuthenticated = false;
    },
  },
});

export const {
  setUserEmail,
  markAsNewUser,
  markAsExistingUser,
  authenticateUser,
  setUserName,
  resetUser,
} = userSlice.actions;

export default userSlice.reducer;
