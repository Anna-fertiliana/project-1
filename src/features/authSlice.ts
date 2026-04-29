import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  role: "USER" | "ADMIN";
}

type ViewMode = "USER" | "ADMIN";

interface AuthState {
  token: string | null;
  user: User | null;
  viewMode: ViewMode;
}

interface AuthPayload {
  token: string;
  user: User | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
  viewMode: "USER",
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

      const defaultMode: ViewMode =
        user?.role === "ADMIN"
          ? "ADMIN"
          : "USER";

      state.viewMode = defaultMode;

      localStorage.setItem("token", token);

      if (user) {
        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );
      }

      localStorage.setItem(
        "viewMode",
        defaultMode
      );
    },

    restoreAuth: (
      state,
      action: PayloadAction<AuthPayload>
    ) => {
      const { token, user } = action.payload;

      state.token = token;
      state.user = user;

      const savedMode =
        localStorage.getItem(
          "viewMode"
        ) as ViewMode | null;

      if (
        user?.role === "ADMIN" &&
        savedMode
      ) {
        state.viewMode = savedMode;
      } else {
        state.viewMode = "USER";
      }
    },

    setViewMode: (
      state,
      action: PayloadAction<ViewMode>
    ) => {
      if (state.user?.role !== "ADMIN") {
        return;
      }

      state.viewMode = action.payload;

      localStorage.setItem(
        "viewMode",
        action.payload
      );
    },

    logout: (state) => {
      state.token = null;
      state.user = null;
      state.viewMode = "USER";

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("viewMode");
    },
  },
});

export const {
  setAuth,
  restoreAuth,
  logout,
  setViewMode,
} = authSlice.actions;

export default authSlice.reducer;