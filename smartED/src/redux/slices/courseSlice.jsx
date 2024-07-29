import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  step: 1,
  course: null,
  editCourse: false,
  paymentLoading: false,
};
const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setStep: (state, action) => {
      state.step = action.payload;
    },

    setEdiCourse: (state, action) => {
      state.editCourse = action.payload;
    },

    setCourse: (state, action) => {
      state.course = action.payload;
    },
    setPaymentLoading: (state, action) => {
      state.paymentLoading = action.payload;
    },

    resetCourseState: (state) => {
      state.step = 1;
      state.course = null;
      state.editCourse = false;
    },
  },
});

export const {
  setCourse,
  setEdiCourse,
  setPaymentLoading,
  resetCourseState,
  setStep,
} = courseSlice.actions;

export default courseSlice.reducer;
