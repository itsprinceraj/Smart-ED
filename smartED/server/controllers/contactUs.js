const { contactUsEmail } = require("../mail/templates/contactFormRes");
const mailSender = require("../utilities/mailSender");
const ContactUs = require("../models/contact");

exports.contactUsController = async (req, res) => {
  const { email, firstname, lastname, message, phoneNo, countrycode } =
    req.body;
  console.log(req.body);
  try {
    const emailRes = await mailSender(
      email,
      "Your Data send successfully , We will Reach you in 2-3 working Days",
      contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
    );
    console.log("Email Res ", emailRes);
    const contactData = await ContactUs.create({
      firstname: firstname,
      lastname: lastname,
      email: email,
      countrycode: countrycode,
      phoneNo: phoneNo,
      message: message,
    });

    //if data is not saved to dataBase
    if (!contactData) {
      return res.json({
        success: false,
        message: "Unable to enter data in to the database",
      });
    }
    return res.json({
      success: true,
      message: "Email send successfully",
      data: { emailRes, contactData },
    });
  } catch (error) {
    console.log("Error", error);
    return res.json({
      success: false,
      message: "Something went wrong...while sending mail",
    });
  }
};
