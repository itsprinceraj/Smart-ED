const { default: mongoose } = require("mongoose");
const Course = require("../models/course");
const User = require("../models/user");
// const { instance } = require("../config/razorpay");
const mailSender = require("../utilities/mailSender");
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");
// const { default: orders } = require("razorpay/dist/types/orders");

// create Payment integration Handler
exports.capturePayment = async (req, res) => {
  try {
    // get course id and user id
    const { course_id } = req.body;
    const userId = req.user.userId;

    // check whether course id is valid or not
    if (!course_id) {
      return res.status(401).json({
        success: false,
        message: "Course Id is not valid",
      });
    }

    // check whether the course coming from course_id is valid or not
    let course;
    try {
      course = await Course.findById(course_id);
      if (!course) {
        return res.status(401).json({
          success: false,
          message: "course does not exist",
        });
      }

      // check wheher user is enrolled for the course or not
      const uid = mongoose.Schema.Types.ObjectId(userId);
      if (course.studentsEnrolled.includes(uid)) {
        return res.status(200).json({
          success: false,
          message: "User is already enrolled",
        });
      }
    } catch (err) {
      console.log(err);
      res.status(408).json({
        success: false,
        message: err.message,
      });
    }

    // create a order now
    try {
      // create a payment order
      const amount = course.price;
      const currency = "INR";

      const options = {
        amount: amount * 100,
        currency,
        receipt: Date.now().toString(),
        notes: {
          course_id,
          userId,
        },
      };

      // initiate the payment order
      const paymentResponse = await instance.orders.create(options);
      console.log(paymentResponse);

      return res.status(200).json({
        success: true,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        thumbnail: course.thumbnail,
        orderId: paymentResponse.id,
        currency: paymentResponse.currency,
        amount: paymentResponse.amount,
      });

      // send a successfull response with success flag
    } catch (err) {
      console.log("err while initiating order", err);
      res.status(402).json({
        success: false,
        message: "error while initiating ",
      });
    }
  } catch (err) {
    console.log("facing issue while capturing payment", err);
    res.status(500).json({
      success: false,
      message: "Cannot capture Payment",
    });
  }
};

// verify Signature for authorisation on razorpay
exports.verifySignature = async (req, res) => {
  try {
    // create a webhook secret key
    const webhookSecret = "123456";

    // get a signature from razorpay
    const signature = req.headers["x-razorpay-signature"];

    // for matching both razorpay signature and serverWebhook so that authentication is completed you have to encrypt your secKey , cause razorpay signature once encrypted never be decrypted . so encrypt your webhook key

    const shasum = crypto.createHmac("sha256", webhookSecret); // returns a object , so convert it in string

    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex"); // digest term is used for encrypted format secret key and it contains in hexadecimal code

    // payment is authorised, now add course to user dashboard
    if (signature === digest) {
      console.log("Payment is Authorized");

      // after authorisation a response will be sent by razorpay. in which we have sent notes ,while initialising the order , it contains courseid and userid

      // extract courseId and userId from response
      try {
        const { courseId, userId } = req.body.payload.paytment.entity.notes;

        // add userId into studedntsEnrolled by searching courseId
        const enrolledCourse = await Course.findOneAndUpdate(
          { _id: courseId },
          {
            $push: {
              studentsEnrolled: userId,
            },
          },
          { new: true }
        );

        // check if enrolledCourse comes or not
        if (!enrolledCourse) {
          return res.status(500).json({
            success: false,
            message: "Course not found",
          });
        }
        console.log(enrolledCourse);

        // add courseId into users enrollment
        const enrolledStudent = await User.findOneAndUpdate(
          { _id: userId },
          {
            $push: { courses: courseId },
          },
          { new: true }
        );

        console.log(enrolledStudent);

        //  Send Enrollment mail
        const emailRespnse = await mailSender(
          enrolledStudent.email,
          "Congratulations from Studyem",
          "you are enrolled successfully"
        );

        console.log(emailRespnse);

        // send response
        return res.status(200).json({
          success: true,
          message: "Payment done and enrolled succesfully ",
        });
      } catch (err) {
        console.log(err);
        res.status(500).json({
          success: false,
          message: err.message,
        });
      }
    } else {
      res.status(500).json({
        success: false,
        message: "Invalid request",
      });
    }
  } catch (err) {
    console.log("facing issue while verifying signature", err);
    res.status(500).json({
      success: false,
      message: "Unable to verify signature",
    });
  }
};
