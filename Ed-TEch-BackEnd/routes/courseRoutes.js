const express = require("express");
const router = express.Router();

// now we can add handlers here

//Course Handler
const {
  createCourse,
  showAllCourses,
  getCourseDetails,
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

// define routes
router.post("createCourse", auth, isInstructor);
router.get("showAllCourses", auth, isStudent, isInstructor);
router.get("getCourseDetails", auth, isStudent, isInstructor);

module.exports = router;
