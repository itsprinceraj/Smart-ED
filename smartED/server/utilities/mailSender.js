const nodeMailer = require("nodemailer"); // import nodemailer
require("dotenv").config();
const MAIL_HOST = process.env.MAIL_HOST;
const MAIL_USER = process.env.MAIL_USER;
const MAIL_PASS = process.env.MAIL_PASS;

const mailSender = async (email, title, body) => {
  try {
    // create Transporter

    // create options
    const options = {
      host: MAIL_HOST,
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
      },
    };
    let transporter = nodeMailer.createTransport(options);

    // SEND MAIL
    let info = transporter.sendMail({
      from: "SMART-ED || BY - SMART-ED corps ",
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });
    console.log(info);
  } catch (err) {
    console.log("Error occured while sending mail", err);
  }
};

// export mailsender

module.exports = mailSender;
