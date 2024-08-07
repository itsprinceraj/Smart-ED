const User = require("../models/user");
const OTP = require("../models/otp");
const Profile = require("../models/profile");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secKey = process.env.SEC_KEY;
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const mailSender = require("../utilities/mailSender");

//send otp
exports.sendOTP = async (req, res) => {
  try {
    // fetch data from body
    const { email } = req.body;

    // await OTP.findOneAndDelete({ email });

    // check email exist or not
    const checkUser = await User.findOne({ email });

    //if user exist , then return it to login page
    if (checkUser) {
      return res.status(200).json({
        success: false,
        message: "User already Registered",
      });
    }

    // if user is new, then send otp
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    // console.log("OTP: ", otp);

    // check that otp is unique
    // let checkOTP = await OTP.findOne({ otp: otp });

    // *****this is a too bad code , we dont'ever have to opearate loop on DB
    // while (checkOTP) {
    //   otp = otpGenerator.generate(6, {
    //     upperCaseAlphabets: false,
    //     lowerCaseAlphabets: false,
    //     specialChars: false,
    //   });
    //   checkOTP = await OTP.findOne({ otp: otp });
    // }

    // after sending otp succesfully , create entry in DB
    const otpBody = await OTP.create({ email, otp });
    // console.log("otp", otpBody);

    // send success response
    res.status(200).json({
      success: true,
      message: "OTP sent Successfully",
    });
  } catch (err) {
    console.log("error occured while sending otp", err);
    res.status(401).json({
      success: false,
      message: "Facing Problem in sending otp",
    });
  }
};

// sign Up

exports.signUP = async (req, res) => {
  try {
    // fetch data from req body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    // check all details are entered or not
    if (
      !firstName ||
      !lastName ||
      !password ||
      !confirmPassword ||
      !email ||
      !otp
    ) {
      return res
        .status(409) // required details are empty
        .json({
          success: false,
          message: "Please fill Required Details",
        });
    }

    //  printing signupData
    console.log("print signup data :", otp);

    // match both the passwords
    if (password !== confirmPassword) {
      return res
        .status(200) // data did not matched
        .json({
          success: false,
          message: "Password did not match , please enter Again",
        });
    }

    // check that user exist in database or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(200) // conflict
        .json({
          success: false,
          message: "User already Registered",
        });
    }

    // fetch the most recent otp form dataBase
    const recentOtpDocument = await OTP.find({ email })
      .sort({ createdAt: -1 }) // Sort in descending order by createdAt
      .limit(1); // Limit to return only one document

    // Check if we got any OTP document
    if (recentOtpDocument.length === 0) {
      return res.status(200).json({
        success: false,
        message: "OTP not Found",
      });
    }

    const newRecentOtp = recentOtpDocument[0].otp; // Access the OTP from the first document

    // Log the OTP values
    console.log("otp:", recentOtpDocument);
    console.log("newRecentOtp", newRecentOtp);

    // Check if the OTPs match
    if (otp !== newRecentOtp) {
      return res.status(200).json({
        success: false,
        message: "Invalid OTP",
      });
    }
    // hash the pasword
    const hashPassword = await bcrypt.hash(password, 10); // hash Password with 10 salt Round

    // create entry in db

    // console.log(hashPassword);
    // create a profile object

    // Create the user
    let approved = "";
    approved === "Instructor" ? (approved = false) : (approved = true);

    const profileDetails = await Profile.create({
      dateOfBirth: null,
      contactNumber: null,
      gender: null,
      about: null,
    });

    // console.log(profileDetails);
    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashPassword,
      confirmPassword,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`, //api for creating Avatar using firstName and lastName
    });

    // send a succes response
    res.status(200).json({
      success: true,
      message: "User Registered Succesfully ",
      user,
    });
  } catch (err) {
    console.log("error occured while user registration", err);
    res.status(500).json({
      success: false,
      message: "Facing Problem while registration",
    });
  }
};

// Login

exports.login = async (req, res, next) => {
  try {
    // fetch data form req.body
    const { email, password } = req.body;

    // check if email and password fields are empty
    if (!email || !password) {
      return res.status(409).json({
        success: false,
        message: "Email and password not Entered",
      });
    }

    // Search and Check if user is not registered
    let user = await User.findOne({ email }); // returns array of objects

    if (!user) {
      return res.status(200).json({
        success: false,
        message: "User not Found",
      });
    }
    // console.log(user);

    // match the password and generate Token
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };
      const token = jwt.sign(payload, secKey, {
        expiresIn: "3d",
      });

      // user = user.toObject();
      user.token = token; // created new field in payload
      user.password = undefined;

      // send cookie in response
      const options = {
        expiresIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,
      };

      // console.log(user);

      res.cookie("token", token, options).status(200).json({
        success: true,
        user,
        token,
        message: " User Logged In Successfully",
      });
    } else {
      res.status(200).json({
        success: false,
        message: "Incorrect Password",
      });
    }
  } catch (err) {
    console.log("facing issue while loging in", err);
    res.status(401).json({
      success: false,
      message: "Login failed",
    });
  }
  next();
};

// change password

exports.changePassword = async (req, res) => {
  try {
    // Get user data from req.user
    const userDetails = await User.findById(req.user.id);

    // Get old password, new password, and confirm new password from req.body
    const { oldPassword, newPassword } = req.body;

    // Validate old password , that it matches to your current account password or not
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    );
    if (!isPasswordMatch) {
      // If old password does not match, return a 401 (Unauthorized) error
      return res
        .status(401)
        .json({ success: false, message: "The password is incorrect" });
    }

    // Update password
    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    );

    // Send notification email
    try {
      const emailResponse = await mailSender(
        updatedUserDetails.email,
        "Password for your account has been updated",
        passwordUpdated(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
        )
      );
      console.log("Email sent successfully:", emailResponse);
    } catch (error) {
      // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while sending email:", error);
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      });
    }

    // Return success response
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.log("error occurred while updating password", err);
    res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
    });
  }
};
