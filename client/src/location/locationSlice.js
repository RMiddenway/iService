import { createSlice } from '@reduxjs/toolkit';

export const locationSlice = createSlice({
  name: "location",
  initialState: {
    lastLocation: { lat: 0, lng: 0 },
  },
  reducers: {
    setLastLocation: (state, action) => {
      state.lastLocation = action.payload;
      console.log(state.lastLocation);
    },
  },
});

// Action creators are generated for each case reducer function
export const { setLastLocation } = locationSlice.actions;

export default locationSlice.reducer;
