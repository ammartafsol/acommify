import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  availableTokens: 0,
  favouriteItems: [], // Initialize with an empty array
};

const commonSlice = createSlice({
  name: "commonSlice",
  initialState,
  reducers: {
    setAvailableTokens: (state, action) => {
      state.availableTokens = action.payload;
    },
    setFavouriteItems: (state, action) => {
      state.favouriteItems = action.payload;
    },
  },
});

export const { setAvailableTokens, setFavouriteItems } = commonSlice.actions;

export default commonSlice.reducer;
