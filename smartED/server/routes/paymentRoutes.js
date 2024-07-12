const express = require("express");
const router = express.Router();

// Payment Handler
const { capturePayment, verifySignature } = require("../controllers/payments");

// MiddleWares
const { auth, isStudent } = require("../middlewares/authoriseUser");

//define Routes

router.post("/capturePayment", auth, isStudent, capturePayment);
router.post("/verifySignature", verifySignature);

module.exports = router;
