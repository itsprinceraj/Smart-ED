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

    await OTP.findOneAndDelete({ email });

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

    // match both the passwords
    if (password !== confirmPassword) {
      return res
        .status(422) // data did not matched
        .json({
          success: false,
          message: "Password did not match , please enter Again",
        });
    }

    // check that user exist in database or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409) // conflict
        .json({
          success: false,
          message: "User already Registered",
        });
    }

    // fetch the most recent otp form dataBase
    const recentOtp = await OTP.findOne({ email })
      // .select("otp")
      .sort({ createdAt: -1 }) // returns the most recent Document created
      .limit(1); //it limits the number of document returned
    const newRecentOtp = recentOtp.otp;

    // console.log(recentOtp);

    // check if otp matched or not
    if (newRecentOtp.length == 0 || otp !== newRecentOtp) {
      return res.status(499).json({
        success: false,
        message: "OTP not Found",
      });
    }
    // else if (otp !== recentOtp) {
    //   res.status(422).json({
    //     success: false,
    //     message: "Invalid OTP",
    //   });
    // }

    // hash the pasword
    const hashPassword = await bcrypt.hash(password, 10); // hash Password with 10 salt Round

    // create entry in db

    // console.log(hashPassword);
    // create a profile object

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

    // delete otp from database;
    await OTP.findOneAndDelete({ otp });

    // send a succes response
    res.status(200).json({
      success: true,
      messsage: "User Registered Succesfully ",
      user,
    });
  } catch (err) {
    console.log("error occured while user registration", err);
    res.status(500).json({
      success: false,
      message: "Facing Problem in while registration",
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
        expiresIn: "2hr",
      });

      // user = user.toObject();
      user.token = token; // created new field in payload
      user.password = undefined;

      // send cookie in response
      const options = {
        expiresIn: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
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
    // fetch data from req body
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    // check if these fields are empty or not
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return res.status(409).json({
        success: false,
        message: "Please enter the passwords",
      });
    } else if (oldPassword == (newPassword || confirmNewPassword)) {
      return res.status(409).json({
        success: false,
        message: "new password is same as your old one",
      });
    }

    // if password entered then match new and confirm password and also check that it is different from the oldpassword
    if (newPassword !== confirmNewPassword) {
      return res.status(409).json({
        success: false,
        message: "Password not matched",
      });
    }

    //  password is matched and the password is unique from the previous one, hash the password

    const encryptPass = await bcrypt.hash(newPassword, 10);

    // now create entry in database
    const user = await User.findOneAndUpdate(
      { email: email },
      { password: encryptPass },
      { new: true }
    );

    // password is updated , now send mail to user that their password is updated succesfully

    try {
      const emailResponse = await mailSender(
        user.email,
        "Password for your account has been updated",
        passwordUpdated(
          user.email,
          `Password updated successfully for ${user.firstName} ${user.lastName}`
        )
      );
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: err.message,
      });
    }

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    console.log("error occurred while updating password", err);
    res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
    });
  }
};
