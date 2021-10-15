import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isSignedIn: false,
    userType: "",
  },
  reducers: {
    setSignedIn: (state) => {
      state.isSignedIn = true;
    },
    setSignedOut: (state) => {
      state.isSignedIn = false;
      state.userType = "";
    },
    setUserType: (state, action) => {
      state.userType = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setSignedIn, setSignedOut, setUserType } = authSlice.actions;

export default authSlice.reducer;
