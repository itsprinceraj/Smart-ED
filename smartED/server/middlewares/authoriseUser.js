const jwt = require("jsonwebtoken");
require("dotenv").config();
const secKey = process.env.SEC_KEY;
const User = require("../models/user");
// Authorization for creating Protected route
exports.auth = async (req, res, next) => {
  try {
    // fetch toke from req -> header , body or cookie
    const authHeader = req.header("Authorization");
    const token = (authHeader && authHeader.split(" ")[1]) || req.cookies.token;

    // console.log(token);

    // If JWT is missing, return 401 Unauthorized response
    if (!token) {
      return res.status(401).json({ success: false, message: `Token Missing` });
    }

    // decode it and verify that token matches or not
    try {
      // console.log("decode chl rha h?");
      const decode = jwt.verify(token, secKey);
      // console.log(decode);
      req.user = decode;
      // console.log(decode);

      // return response
      // res.status(200).json({
      //   success: true,
      //   message: "Token verified and Logged in Successfully",
      //   data: decode,
      // });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "token is invalid",
      });
    } // If JWT is valid, move on to the next middleware or request handler
    next();
  } catch (err) {
    console.log("authentication error", err);
    res.status(401).json({
      success: false,
      message: "authentication Failed",
    });
  }
};

// isStudent
exports.isStudent = async (req, res, next) => {
  try {
    const userDetails = await User.findOne({ email: req.user.email });
    // match account type and check authorisation
    if (userDetails.accountType !== "Student") {
      res.status(403).json({
        success: false,
        message: "this is a protected Route for Students Only",
      });
    }
    next();
  } catch (err) {
    console.log("authentication error", err);
    res.status(401).json({
      success: false,
      message: "User role cannot be verified",
    });
  }
};

// isAdmin
exports.isAdmin = async (req, res, next) => {
  try {
    const userDetails = await User.findOne({ email: req.user.email });
    // match account type and check authorisation

    if (userDetails.accountType !== "Admin") {
      res.status(401).json({
        success: false,
        message: "this is a protected Route for Admin Only",
      });
    }
    next();
  } catch (err) {
    console.log("authentication error", err);
    res.status(401).json({
      success: false,
      message: "User role cannot be verified",
    });
  }
};

// isInstructor

exports.isInstructor = async (req, res, next) => {
  try {
    const userDetails = await User.findOne({ email: req.user.email });
    // match account type and check authorisation
    if (userDetails.accountType !== "Instructor") {
      res.status(401).json({
        success: false,
        message: "this is a protected Route for Instructor Only",
      });
    }
    next();
  } catch (err) {
    console.log("authentication error", err);
    res.status(500).json({
      success: false,
      message: "User role cannot be verified",
    });
  }
};
