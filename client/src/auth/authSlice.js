import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isSignedIn: false,
    userType: "",
    userId: "",
  },
  reducers: {
    setSignedIn: (state, action) => {
      state.isSignedIn = true;
      localStorage.setItem("IS_SIGNED_IN", "true");
      state.userId = action.payload;
      localStorage.setItem("USER_ID", action.payload);
    },
    setSignedOut: (state) => {
      localStorage.setItem("IS_SIGNED_IN", "false");
      localStorage.setItem("USER_TYPE", "");
      state.isSignedIn = false;
      state.userType = "";
      state.userId = "";
      localStorage.setItem("USER_ID", "");
    },
    // todo - get this from server or on login, become expert
    setUserType: (state, action) => {
      state.userType = action.payload;
      localStorage.setItem("USER_TYPE", action.payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const { setSignedIn, setSignedOut, setUserType } = authSlice.actions;

export default authSlice.reducer;
