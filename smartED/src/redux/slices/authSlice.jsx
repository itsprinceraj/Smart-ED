// now create slices you want to use in your project
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token"))
    : null,
  signupData: null,
  loading: false,
};
const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    // whenever we create reducers , initial state and action is passes in it
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setSignupData: (state, action) => {
      state.signupData = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

// export using actions
export const { setToken, setLoading, setSignupData } = authSlice.actions;

// now export reducers default
export default authSlice.reducer;
