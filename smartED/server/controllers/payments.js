// const { default: mongoose } = require("mongoose");
const { default: mongoose } = require("mongoose");
const Course = require("../models/course");
const User = require("../models/user");
const CourseProgress = require("../models/courseProgress");
const { instance } = require("../config/razorpay");
const mailSender = require("../utilities/mailSender");
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");
const {
  paymentSuccessEmail,
} = require("../mail/templates/paymentSuccessEmail");
require("dotenv").config();
const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET;
// const { default: orders } = require("razorpay/dist/types/orders");

// ***************** these handler are only used to buy single product ,

// create Payment integration Handler
// exports.capturePayment = async (req, res) => {
//   try {
//     // get course id and user id
//     const { course_id } = req.body;
//     const userId = req.user.userId;

//     // check whether course id is valid or not
//     if (!course_id) {
//       return res.status(401).json({
//         success: false,
//         message: "Course Id is not valid",
//       });
//     }

//     // check whether the course coming from course_id is valid or not
//     let course;
//     try {
//       course = await Course.findById(course_id);
//       if (!course) {
//         return res.status(401).json({
//           success: false,
//           message: "course does not exist",
//         });
//       }

//       // check wheher user is enrolled for the course or not
//       const uid = mongoose.Schema.Types.ObjectId(userId);
//       if (course.studentsEnrolled.includes(uid)) {
//         return res.status(200).json({
//           success: false,
//           message: "User is already enrolled",
//         });
//       }
//     } catch (err) {
//       console.log(err);
//       res.status(408).json({
//         success: false,
//         message: err.message,
//       });
//     }

//     // create a order now
//     try {
//       // create a payment order
//       const amount = course.price;
//       const currency = "INR";

//       const options = {
//         amount: amount * 100,
//         currency,
//         receipt: Date.now().toString(),
//         notes: {
//           course_id,
//           userId,
//         },
//       };

//       // initiate the payment order
//       const paymentResponse = await instance.orders.create(options);
//       console.log(paymentResponse);

//       return res.status(200).json({
//         success: true,
//         courseName: course.courseName,
//         courseDescription: course.courseDescription,
//         thumbnail: course.thumbnail,
//         orderId: paymentResponse.id,
//         currency: paymentResponse.currency,
//         amount: paymentResponse.amount,
//       });

//       // send a successfull response with success flag
//     } catch (err) {
//       console.log("err while initiating order", err);
//       res.status(402).json({
//         success: false,
//         message: "error while initiating ",
//       });
//     }
//   } catch (err) {
//     console.log("facing issue while capturing payment", err);
//     res.status(500).json({
//       success: false,
//       message: "Cannot capture Payment",
//     });
//   }
// };

// // verify Signature for authorisation on razorpay
// exports.verifySignature = async (req, res) => {
//   try {
//     // create a webhook secret key
//     const webhookSecret = "123456";

//     // get a signature from razorpay
//     const signature = req.headers["x-razorpay-signature"];

//     // for matching both razorpay signature and serverWebhook so that authentication is completed you have to encrypt your secKey , cause razorpay signature once encrypted never be decrypted . so encrypt your webhook key

//     const shasum = crypto.createHmac("sha256", webhookSecret); // returns a object , so convert it in string

//     shasum.update(JSON.stringify(req.body));
//     const digest = shasum.digest("hex"); // digest term is used for encrypted format secret key and it contains in hexadecimal code

//     // payment is authorised, now add course to user dashboard
//     if (signature === digest) {
//       console.log("Payment is Authorized");

//       // after authorisation a response will be sent by razorpay. in which we have sent notes ,while initialising the order , it contains courseid and userid

//       // extract courseId and userId from response
//       try {
//         const { courseId, userId } = req.body.payload.paytment.entity.notes;

//         // add userId into studedntsEnrolled by searching courseId
//         const enrolledCourse = await Course.findOneAndUpdate(
//           { _id: courseId },
//           {
//             $push: {
//               studentsEnrolled: userId,
//             },
//           },
//           { new: true }
//         );

//         // check if enrolledCourse comes or not
//         if (!enrolledCourse) {
//           return res.status(500).json({
//             success: false,
//             message: "Course not found",
//           });
//         }
//         console.log(enrolledCourse);

//         // add courseId into users enrollment
//         const enrolledStudent = await User.findOneAndUpdate(
//           { _id: userId },
//           {
//             $push: { courses: courseId },
//           },
//           { new: true }
//         );

//         console.log(enrolledStudent);

//         //  Send Enrollment mail
//         const emailRespnse = await mailSender(
//           enrolledStudent.email,
//           "Congratulations from SmartED",
//           "you are enrolled successfully"
//         );

//         console.log(emailRespnse);

//         // send response
//         return res.status(200).json({
//           success: true,
//           message: "Payment done and enrolled succesfully ",
//         });
//       } catch (err) {
//         console.log(err);
//         res.status(500).json({
//           success: false,
//           message: err.message,
//         });
//       }
//     } else {
//       res.status(500).json({
//         success: false,
//         message: "Invalid request",
//       });
//     }
//   } catch (err) {
//     console.log("facing issue while verifying signature", err);
//     res.status(500).json({
//       success: false,
//       message: "Unable to verify signature",
//     });
//   }
// };

// ******************* we want to buy multiple course  by adding product in cart

exports.capturePayment = async (req, res) => {
  // ********** initiatin an payment order **********
  // fetch courses from req body
  const { courses } = req.body;
  const userId = req.user.id;

  //  validate if no courses found
  if (courses.length === 0) {
    return res.json({
      success: false,
      message: "Please provide course id",
    });
  }

  //  if courses found then calculate total amount
  let totalAmount = 0;

  // find course from course id
  for (const course_id in courses) {
    let course;
    try {
      //  find course on the basis of course_id
      course = await Course.findById(course_id);

      //  validate if course found or not
      if (!course) {
        return res.status(200).json({
          success: false,
          messge: "No course found",
        });
      }

      //  create a user id
      const uid = mongoose.Types.ObjectId(userId);

      //  on the basis of uid , check that students are enrolled into the course or not
      if (course.studentsEnrolled.includes(uid)) {
        return res.status(200).json({
          success: false,
          message: "Student id alrready enrolled",
        });
      }

      //  if not enrolled show totalAmount of the course
      totalAmount += course.price;

      //send success response
      res.status(200).json({
        success: true,
        message: "Order initiated successfully",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  //   now create a payment options
  const options = {
    amount: totalAmount * 100,
    receipt: Math.random(Date.now()).toString(),
    currency: "INR",
  };

  //  now create order
  try {
    const paymentResponse = await instance.orders.create(options);
    res.status(200).json({
      success: true,
      message: "Payment order created successfully",
      data: paymentResponse,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Unable to create payment order",
    });
  }
};

//  for verifying payment signature
exports.verifyPayment = async (req, res) => {
  //  fetch necessary fields for signature verification
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_order_id = req.body?.razorpay_order_id;
  const razorpay_signature = req.body?.razorpay_signature;

  //  get course and user id
  const courses = req.body?.courses;
  const userId = req.user.id;

  // create a signature using HMAC SHA256 algorithm
  let body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", RAZORPAY_SECRET) // create hmac using crypto with sha256 algo and update body
    .update(body.toString())
    .digest("Hex"); // digest that hex sign

  if (expectedSign === razorpay_signature) {
    // enrooll students to the course

    await enrollStudents(courses, userId, res);

    // send success response
    res.status(200).json({
      success: true,
      message: "Payment accepted",
    });
  }

  return res.status(200).json({
    success: false,
    message: "Payment Failed",
  });
};

//  create a function for enrolling students
const enrollStudents = async (courses, userId, res) => {
  //  validate karlo data aya hai ya ni
  if (!courses || !userId) {
    return res.status(400).json({
      success: false,
      message: "Course and user not found",
    });
  }

  //  students ko enroll kardo course me
  for (const courseId of courses) {
    try {
      const enrollCourses = await Course.findOneAndUpdate(
        {
          _id: courseId,
        },
        { $push: { studentsEnrolled: userId } },
        { new: true } // return new doc
      );

      // validate kar lo
      if (!enrollCourses) {
        return res.status(500).json({
          success: false,
          message: "Unable to enrole student into courses",
        });
      }

      //  create course Progress fields in db
      const courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      });

      //  ab students ki data me courses ko dall do
      const enrollStudents = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: courseId,
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      );

      //  validate kar lo data ko
      if (!enrollStudents) {
        return res.status(400).json({
          success: false,
          message: "Unable to add courses to students data",
        });
      }

      // mail send krdo
      const mailResponse = mailSender(
        enrollStudents.email,
        `Successfully enrolled into ${enrollCourses.courseName} `,
        courseEnrollmentEmail(
          enrollCourses.courseName,
          `${enrollStudents.firstName}`
        )
      );

      console.log("email sent successfully", mailResponse);

      res.status(200).json({
        success: true,
        message: "Course enrolled succesfully ",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
};

// Send Payment Success Email
exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;

  // get user id
  const userId = req.user.id;

  // validate data
  if (!orderId || !paymentId || !amount || !userId) {
    return res.status(400).json({
      success: false,
      message: "Please provide all the details",
    });
  }

  //  get enrolled student data from userId

  try {
    const enrolledStudent = await User.findById(userId);

    //  send a payment succes mail
    const mailRes = await mailSender(
      enrolledStudent.email,
      `Payment Received`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    );

    //  send success response
    res.status(200).json({
      success: true,
      message: "Payment done and mail send successfully",
      data: mailRes,
    });
  } catch (error) {
    console.log("error in sending mail", error);
    return res.status(400).json({
      success: false,
      message: "Could not send email",
    });
  }
};
