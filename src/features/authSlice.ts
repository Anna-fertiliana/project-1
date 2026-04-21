import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  role: "USER" | "ADMIN";
}

interface AuthState {
  token: string | null;
  user: User | null;
}

interface AuthPayload {
  token: string;
  user: User | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<AuthPayload>
    ) => {
      const { token, user } = action.payload;

      state.token = token;
      state.user = user;

      localStorage.setItem("token", token);

      if (user) {
        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );
      }
    },

    restoreAuth: (
      state,
      action: PayloadAction<AuthPayload>
    ) => {
      const { token, user } = action.payload;

      state.token = token;
      state.user = user;
    },

    logout: (state) => {
      state.token = null;
      state.user = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const {
  setAuth,
  restoreAuth,
  logout,
} = authSlice.actions;

export default authSlice.reducer;