import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};
const profileSlice = createSlice({
  name: "profile",
  initialState: initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

// export by using actions
export const { setUser } = profileSlice.actions;

// export by using reducer
export default profileSlice.reducer;
