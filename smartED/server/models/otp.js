const mongoose = require("mongoose");
const mailSender = require("../utilities/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");
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
    expires: 5 * 60, // The document will be automatically deleted after 5 minutes of its creation time
  },
});

const sendVerificationMail = async (email, otp) => {
  try {
    // send mail
    const mailResponse = await mailSender(
      email,
      "Verification Email from SMART-ED",
      emailTemplate(otp)
    );
    console.log("Email Sent SuccesFully", mailResponse);
  } catch (err) {
    console.log("error occured while verification mail verification", err);
  }
};

// write pre middleware to send emails
OTPSchema.pre("save", async function (next) {
  // Only send an email when a new document is created
  if (this.isNew) {
    await sendVerificationMail(this.email, this.otp);
  }
  next();
});

// export schema
module.exports = mongoose.model("OTP", OTPSchema);
