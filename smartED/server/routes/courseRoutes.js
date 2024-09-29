const express = require("express");
const router = express.Router();

// now we can add handlers here

//Course Handler
const {
  createCourse,
  showAllCourses,
  getCourseDetails,
  deleteCourse,
  getInstructorCourses,
  updateCourse,
  getFullCourseDetails,
} = require("../controllers/course");

// Categories Handler
const {
  createCategory,
  showAllCategories,
  categoryPageDetails,
} = require("../controllers/categories");

// Rating And Reviews Handler
const {
  createRating,
  getAverageRating,
  getAllRating,
} = require("../controllers/ratingAndReviews");

//Section Handler
const {
  createSection,
  getSectionDetails,
  updateSection,
  deleteSection,
} = require("../controllers/section");

// SubSection Handlers
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/subSection");

// MiddleWares
const {
  auth,
  isAdmin,
  isInstructor,
  isStudent,
} = require("../middlewares/authoriseUser");
const upload = require("../utilities/multer");
const { updateCourseProgress } = require("../controllers/courseProgress");

//  add to cart controller
const {
  addCourseToCart,
  removeCourseFromCart,
} = require("../controllers/itemsInCart");

// define routes

//******** courseRoutes*******************
router.post("/createCourse", auth, isInstructor, createCourse);
router.post("/getCourseDetails", getCourseDetails);
router.get("/showAllCourses", showAllCourses);
//  get details for specific course
router.post("/getFullCourseDetails", auth, getFullCourseDetails);
router.put("/updateCourse", auth, isInstructor, updateCourse);
//  get specified instructor courses
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);
router.delete("/deleteCourse", auth, isInstructor, deleteCourse);

//************ sectionRoutes
router.post("/addSection", auth, isInstructor, createSection);
router.put("/updateSection", auth, isInstructor, updateSection);
router.post("/deleteSection", auth, isInstructor, deleteSection);
router.get("/getSectionDetails", auth, isInstructor, getSectionDetails);

// ******************* subSectionRoutes
router.post("/addSubSection", auth, isInstructor, createSubSection);
router.post("/updateSubSection", auth, isInstructor, updateSubSection);
router.delete("/deleteSubSection", auth, isInstructor, deleteSubSection);

//************ ratingAndReviewsRoutes
router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRatings", getAverageRating);
router.get("/getReviews", getAllRating);

//********** categoryRoutes
router.get("/showAllCategories", showAllCategories);
router.post("/getCategoryPageDetails", categoryPageDetails);
router.post("/createCategory", auth, isAdmin, createCategory);

// *************course progress route
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);

// add to cart
router.post("/addToCart", auth, addCourseToCart);
router.post("/removeFromCart", auth, removeCourseFromCart);

// export Router
module.exports = router;
