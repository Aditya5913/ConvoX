import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: localStorage.getItem("userData")
    ? JSON.parse(localStorage.getItem("userData"))
    : null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    setUserDetails: (state, action) => {
      state.userData = action.payload;

      localStorage.setItem("userData", JSON.stringify(action.payload));
    },

    removeUserDetails: (state) => {
      state.userData = null;
      localStorage.removeItem("userData");
    },
  },
});

export const { setUserDetails, removeUserDetails } = userSlice.actions;

export default userSlice.reducer;
