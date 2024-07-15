import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  totalItems: localStorage.getItem("totalItems")
    ? JSON.parse(localStorage.getItem("totalItems"))
    : null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    setCartItems: (state, action) => {
      state.totalItems = action.payload;
    },
  },
});

// export using actions
export const { setCartItems } = cartSlice.actions;

//export using reducers
export default cartSlice.reducer;
