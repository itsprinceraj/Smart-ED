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

// validator
const { validate, password } = require("../data validation/validator");

// define Routes

//************Authenticatin Routes*************

router.post("/test", auth);

router.post("/sendOTP", sendOTP); // for sending OTP
router.post("/signUP", signUP); // user Login Routes
router.post("/login", login); // User SignUp Routes
router.post("/changePassword", auth, validate(password), changePassword); // changePassRoutes

// ***********resetpassword route************
router.post("/reset-password-token", resetPasswordToken);
router.post("/reset-password", resetPassword);

//  routes for google sign in
// router.post("/google-sign-in",googleSignIn)

module.exports = router;
