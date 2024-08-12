const express = require("express");
const router = express.Router();

// Payment Handler
const {
  capturePayment,
  verifyPayment,
  sendPaymentSuccessEmail,
} = require("../controllers/payments");

// MiddleWares
const { auth, isStudent } = require("../middlewares/authoriseUser");

// define Routes

router.post("/capturePayment", auth, isStudent, capturePayment);
router.post("/verifyPayment", auth, isStudent, verifyPayment);
router.post(
  "/sendPaymentSuccessEmail",
  auth,
  isStudent,
  sendPaymentSuccessEmail
);

module.exports = router;
