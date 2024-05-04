const mongoose = require("mongoose");
const mailSender = require("../utilities/mailSender");

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now(),
    expires: 5 * 60,
  },
});

const sendVerificationMail = async (email, otp) => {
  try {
    // send mail
    const mailResponse = await mailSender(
      email,
      "Verification mail from StudyNotion",
      otp
    );
    console.log("Email Sent SuccesFully", mailResponse);
  } catch (err) {
    console.log("error occured while mail verification", err);
  }
};

// write pre middleware to send emails
OTPSchema.pre("save", async function (next) {
  await sendVerificationMail(this.email, this.otp);
  next();
});

// export schema
module.exports = mongoose.model("OTP", OTPSchema);
