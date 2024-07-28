const express = require("express");
const router = express.Router();

//Profile Handlers
const {
  updateProfile,
  deleteProfile,
  getUserDetails,
  uploadDisplayPicture,
  getEnrolledCourses,
} = require("../controllers/profile");

// MiddleWares
const { auth } = require("../middlewares/authoriseUser");

//define Routes
router.put("/updateProfile", auth, updateProfile);
router.post("/deleteProfile", auth, deleteProfile);
router.get("/getUserDetails", auth, getUserDetails);
router.put("/updateDisplayPicture", auth, uploadDisplayPicture);

// **************** enrolled courses ************8
router.get("/getEnrolledCourses", auth, getEnrolledCourses);

module.exports = router;
