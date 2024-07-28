const BASE_URL = "/api/v1";

// CATAGORIES API
export const categories = {
  CATEGORIES_API: BASE_URL + "/course/showAllCategories", // base url with their routes
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

// COURSE DETAILS API
export const userDataEndPoints = {
  ENROLLED_COURSE_DATA_API: BASE_URL + "/profile/getEnrolledCourses",
};
