// we will create a root reducer function in which all the reducers will combined

// for combining all the reducers , import combineReducers
import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "../slices/authSlice"; //  you can import  it with any name you want , untill it is default export
import profileSlice from "../slices/profileSlice";
import cartSlice from "../slices/cartSlice";
import courseSlice from "../slices/courseSlice";
import viewCourseSlice from "../slices/viewCourseSlice";

export const rootReducer = combineReducers({
  // we will mention all the slices here
  auth: authSlice,
  profile: profileSlice,
  cart: cartSlice,
  course: courseSlice,
  viewCourse: viewCourseSlice,
});
