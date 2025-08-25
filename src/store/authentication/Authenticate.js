import { createSlice } from "@reduxjs/toolkit";

// Check for token in localStorage when initializing the app
const token = localStorage.getItem("token");

const initialState = {
  isAuthenticated: !!token, // If token exists, user is authenticated
  token: token || null, // Set token if found in localStorage, otherwise null
};

export const authenticate = createSlice({
  name: "authenticate",
  initialState,
  reducers: {
    setLoginStatus: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated; // Set login status
      state.token = action.payload.token; // Set token on successful login
      if (action.payload.token) {
        localStorage.setItem("token", action.payload.token); // Store token in localStorage
      } else {
        localStorage.removeItem("token"); // Remove token from localStorage on logout
      }
    },
  },
});

export const { setLoginStatus } = authenticate.actions;

export default authenticate.reducer;
