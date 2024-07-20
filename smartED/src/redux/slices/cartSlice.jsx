import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  totalItems: localStorage.getItem("totalItems")
    ? JSON.parse(localStorage.getItem("totalItems"))
    : [],
  cart: localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : 0,

  total: localStorage.getItem("total")
    ? JSON.parse(localStorage.getItem("toatal"))
    : 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    setCartItems: (state, action) => {
      state.totalItems = action.payload;
    },
    resetCartItems: (state, action) => {
      state.cart = [];
      state.total = 0;
      state.totalItems = 0;

      // remove it from localstorage
      localStorage.removeItem("cart");
      localStorage.removeItem("total");
      localStorage.removeItem("totalItems");
    },
  },
});

// export using actions
export const { setCartItems, resetCartItems } = cartSlice.actions;

//export using reducers
export default cartSlice.reducer;
