import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  user_id: string | null;
  userInfo: Record<string, any> | null;
}

const initialState: UserState = {
  user_id: null,
  userInfo: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{
        user_id: string;
        userInfo: Record<string, any | null>;
      }>
    ) => {
      state.user_id = action.payload.user_id;
      state.userInfo = action.payload.userInfo;
    },
    clearUser: (state) => {
      state.user_id = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
