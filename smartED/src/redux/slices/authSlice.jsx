// now create slices you want to use in your project
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token"))
    : null,
};
const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    // whenever we create reducers , initial state and action is passes in it
    seToken: (state, action) => {
      state.token = action.payload;
    },
  },
});

// export using actions
export const { setToken } = authSlice.actions;

// now export reducers default
export default authSlice.reducer;
