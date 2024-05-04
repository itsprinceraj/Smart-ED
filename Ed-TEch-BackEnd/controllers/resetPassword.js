const User = require("../models/user");
const mailSender = require("../utilities/mailSender");
const bcrypt = require("bcrypt");

exports.resetPasswordToken = async (req, res) => {
  try {
    // fetch data from body
    const email = req.body.email;

    // check if user is already registered or not
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Your email is not registered with us",
      });
    }

    // user found . create a reset  , so that it can be embedded in ui link and make it unique everytime
    const token = crypto.randomUUID();

    // update entry in db
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60,
      },
      { new: true }
    );

    // send ui link on email
    const url = `http://localhost:4000/update-password/${token}`;

    // send mail
    await mailSender(
      email,
      "Reset Your Password",
      `Password reset Link: ${url}`
    )
      .res.status(200)
      .json({
        sucess: true,
        message: "Reset Link Sent Successfully",
      });
  } catch (err) {
    console.log("error while password Reser", err);
    res.status(500).json({
      success: false,
      message: "Cannot reset password",
    });
  }
};

// reset password

exports.resetPassword = async (req, res) => {
  try {
    // fetch data from body
    const { password, confirmPassword, token } = req.body;

    // check password mathces or not
    if (password !== confirmPassword) {
      return res.status(403).json({
        success: false,
        message: "Password not matched",
      });
    }

    // password matched
    const userDetails = await User.findOne({ token: token });

    // if token value is invalid
    if (!userDetails) {
      return res.status(403).json({
        success: false,
        message: "Invalid Token",
      });
    }

    // token is valid now
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.status(403).json({
        success: false,
        message: "Token expired",
      });
    }

    // hash the password
    const hashedPassword = bcrypt.hash(password, 10);

    // update entry in database
    const response = await User.findOneAndUpdate(
      { token: token },
      { password: hashedPassword },
      { new: true }
    );

    // send response with success flag
    res.status(200).json({
      success: true,
      message: "password rest Successfully  , now you can login. ",
    });
  } catch (err) {
    console.log("error while reset passweord", err);
    res.status(500).json({
      success: false,
      messsage: "Something Went wrong while reseting the password",
    });
  }
};
