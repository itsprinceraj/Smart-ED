const jwt = require("jsonwebtoken");
require("dotenv").config();
const secKey = process.env.SEC_KEY;

// Authorization for creating Protected route
exports.auth = async (req, res, next) => {
  try {
    // fetch toke from req -> header , body or cookie
    const authHeader = req.header("Authorization");
    const token =
      (authHeader && authHeader.split(" ")[1]) ||
      req.cookies.token ||
      req.body.token;
    // console.log(token);

    // decode it and verify that token matches or not
    try {
      // console.log("decode chl rha h?");
      const decode = jwt.verify(token, secKey);
      // console.log(decode);
      req.user = decode;
      console.log(req.user);

      // return response
      // res.status(200).json({
      //   success: true,
      //   message: "Token verified and Logged in Successfully",
      //   data: decode,
      // });
    } catch (error) {
      res.status(403).json({
        success: false,
        message: "token verificaton failed",
      });
    }
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
    // match account type and check authorisation
    if (req.user.accountType !== "Student") {
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
    // match account type and check authorisation
    if (req.user.accountType !== "Admin") {
      res.status(403).json({
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
    // match account type and check authorisation
    if (req.user.accountType !== "Instructor") {
      res.status(403).json({
        success: false,
        message: "this is a protected Route for Instructor Only",
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
