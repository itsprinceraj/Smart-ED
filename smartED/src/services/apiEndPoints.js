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
};
