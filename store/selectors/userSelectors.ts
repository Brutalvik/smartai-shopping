import { RootState } from "@/store";

export const selectUser = (state: RootState) => state.user;
export const selectUserEmail = (state: RootState) => state.user.email;
export const selectUserGroup = (state: RootState) => state.user.group;
export const selectIsLoggedIn = (state: RootState) => !!state.user.id;
export const selectAccessTokenExpiresAt = (state: RootState) =>
  state.user.accessTokenExpiresAt;
export const selectIsSeller = (state: RootState) =>
  state.user.group === "Sellers";
