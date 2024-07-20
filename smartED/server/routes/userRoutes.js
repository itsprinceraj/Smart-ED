const express = require("express");
const router = express.Router();

// Auth Handler
const {
  sendOTP,
  signUP,
  login,
  changePassword,
} = require("../controllers/authenticate");

// Reset Handlers
const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/resetPassword");

// MiddleWares
const { auth } = require("../middlewares/authoriseUser");

// define Routes

//************Authenticatin Routes*************

router.post("/test", auth);

router.post("/sendOTP", sendOTP); // for sending OTP
router.post("/signUP", signUP); // user Login Routes
router.post("/login", login); // User SignUp Routes
router.post("/changePassword", auth, changePassword); // changePassRoutes

// ***********resetpassword route************
router.post("/reset-password-token", resetPasswordToken);
router.post("/reset-password", resetPassword);

module.exports = router;
