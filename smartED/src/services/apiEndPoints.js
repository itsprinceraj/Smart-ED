const BASE_URL = "/api/v1";

// CATAGORIES API
export const categories = {
  CATEGORIES_API: BASE_URL + "/course/showAllCategories", // base url with their routes
  CATALOG_PAGE_API: BASE_URL + "/course/getCategoryPageDetails",
};

// AUTHENTICATION API
export const authEndpoints = {
  SENDOTP_API: BASE_URL + "/auth/sendOTP",
  SIGNUP_API: BASE_URL + "/auth/signUP",
  LOGIN_API: BASE_URL + "/auth/login",
  RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
};

// CONTACT US API
export const contactUsEnpoints = {
  CONTACT_API: BASE_URL + "/about/contact-us",
};

// SETTINGS API
export const settingEndpoints = {
  UPDATE_DISPLAY_PIC_API: BASE_URL + "/profile/updateDisplayPicture",
  UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
  CHANGE_PASSWORD_API: BASE_URL + "/auth/changePassword",
  DELETE_PROFILE_API: BASE_URL + "/profile/deleteProfile",
};

// USER COURSE DETAILS API
export const userDataEndPoints = {
  ENROLLED_COURSE_DATA_API: BASE_URL + "/profile/getEnrolledCourses",
};

//  COURSE ENDPOINTS
export const courseEndpoints = {
  GET_INSTRUCTOR_COURSES: BASE_URL + "/course/getInstructorCourses",
  DELETE_INSTRUCTOR_COURSE: BASE_URL + "/course/deleteCourse",
  EDIT_COURSE_API: BASE_URL + "/course/updateCourse",
  CREATE_COURSE_API: BASE_URL + "/course/createCourse",
  CREATE_SECTION_API: BASE_URL + "/course/addSection",
  UPDATE_SECTION_API: BASE_URL + "/course/updateSection",
  DELETE_SECTION_API: BASE_URL + "/course/deleteSection",
  ADD_SUB_SECTION_API: BASE_URL + "/course/addSubSection",
  UPDATE_SUB_SECTION_API: BASE_URL + "/course/updateSubSection",
  DELETE_SUB_SECTION_API: BASE_URL + "/course/deleteSubSection",
  GET_SPECIFIC_COURSE_DETAILS: BASE_URL + "/course/getFullCourseDetails",
  GET_COURSE_DETAILS_API: BASE_URL + "/course/getCourseDetails",
  FULL_COURSE_DETAIL_API: BASE_URL + "/course/getFullCourseDetails",
  CREATE_RATING_API: BASE_URL + "/course/createRating",
  LECTURE_COMPLETION_API: BASE_URL + "/course/updateCourseProgress",
};

//  rating and reviews endPoints
export const ratingsEndpoints = {
  REVIEWS_DETAILS_API: BASE_URL + "/course/getReviews",
};

//  payment api
// export const paymentApiEndpoints = {
//   CREATE_PAYMENT_API: BASE_URL + "/payment/createPayment",
//   VERIFY_SIGNATURE_API: BASE_URL + "/payment/verifyPayment",
//   PAYMENT_SUCCESS_EMAIL_API: BASE_URL + "/payment/paymentSuccessEmail",
// };

//   instructor dashboard api
export const dashboard = {
  INSTRUCTOR_DASHBOARD_API: BASE_URL + "/profile/instructoDashboard",
};

export const googleSignup = {
  GOOGLE_SIGNUP_API: BASE_URL + "/auth/google-sign-in",
};
