const express = require("express");
const router = express.Router();

//Profile Handlers
const {
  updateProfile,
  deleteProfile,
  getAllUserDetails,
} = require("../controllers/profile");

// MiddleWares
const { auth } = require("../middlewares/authoriseUser");

//define Routes
router.post("/updateProfile", auth, updateProfile);
router.post("/deleteProfile", deleteProfile);
router.get("/getAllUserDetails", getAllUserDetails);

module.exports = router;
