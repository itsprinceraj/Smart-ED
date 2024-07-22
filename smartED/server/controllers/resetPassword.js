const User = require("../models/user");
const mailSender = require("../utilities/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto"); // to generate univarsal unique id ;

exports.resetPasswordToken = async (req, res) => {
  try {
    // fetch data from body
    const email = req.body.email;

    // console.log("printing email", email);

    // validate
    if (!email) {
      return res.status(200).json({
        success: false,
        message: "Email is required",
      });
    }

    // check if user is already registered or not
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(200).json({
        success: false,
        message: `Your Email (${email}) is not Registered With Us, Please Enter a Valid Email `,
      });
    }

    // user found . create a reset token , so that it can be embedded in ui link and make it unique everytime
    const token = crypto.randomBytes(20).toString("hex");

    // update entry in db
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );

    // send ui link on email
    const url = `http://localhost:5173/reset-password/${token}`;

    // send mail
    await mailSender(
      email,
      "Password Reset",
      `Your Link for Reset Password is ${url}. Please click this url to reset your password.`
    );
    res.status(200).json({
      success: true,
      message: "Reset Link Sent Successfully",
    });
  } catch (err) {
    console.log("error while password Reset", err);
    res.status(500).json({
      success: false,
      message: "Cannot generate reset password token",
    });
  }
};

// reset password

exports.resetPassword = async (req, res) => {
  try {
    // fetch data from body
    const { password, confirmPassword, token } = req.body;

    if (!password || !confirmPassword) {
      res.status(200).json({
        success: false,
        message: "Please fill the required feild",
      });
    }

    //validation
    if (password.length < 8)
      if (password !== confirmPassword) {
        // check password mathces or not
        return res.status(200).json({
          success: false,
          message: "Password do not match",
        });
      }
    // console.log("printing inputs", password, confirmPassword, token);

    // password matched
    const userDetails = await User.findOne({ token: token });

    // if token value is invalid
    if (!userDetails) {
      return res.status(200).json({
        success: false,
        message: "Invalid Token",
      });
    }

    // token is valid now
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.status(200).json({
        success: false,
        message: "Token is Expired, Please Regenerate Your Token",
      });
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    // update entry in database
    await User.findOneAndUpdate(
      { token: token },
      { password: hashedPassword },
      { new: true }
    );

    // send response with success flag
    res.status(200).json({
      success: true,
      message: "Password Updated Successfully  ",
    });
  } catch (err) {
    console.log("error while reset passweord", err);
    res.status(500).json({
      success: false,
      messsage: "Something Went wrong while updating the password",
    });
  }
};
