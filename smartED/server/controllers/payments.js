// // const { default: mongoose } = require("mongoose");
// const { default: mongoose } = require("mongoose");
// const Course = require("../models/course");
// const User = require("../models/user");
// const CourseProgress = require("../models/courseProgress");
// const crypto = require("crypto");

// const mailSender = require("../utilities/mailSender");

// const {
//   courseEnrollmentEmail,
// } = require("../mail/templates/courseEnrollmentEmail");

// const {
//   paymentSuccessEmail,
// } = require("../mail/templates/paymentSuccessEmail");

// require("dotenv").config();
// const { Cashfree } = require("cashfree-pg");
// const CASHFREE_KEY = process.env.CASHFREE_KEY;
// const CASHFREE_SECRET = process.env.CASHFREE_SECRET;

// //  connect cashfree with client id and secret
// Cashfree.XClientId = CASHFREE_KEY;
// Cashfree.XClientSecret = CASHFREE_SECRET;
// Cashfree.XEnvironment = Cashfree.Environment.SANDBOX; // for testing use Sandbox

// // Create Payment Order
// exports.createPayment = async (req, res) => {
//   const { courses } = req.body;
//   const userId = req.user.id;

//   // console.log("printing courses: ", courses);

//   if (courses.length === 0) {
//     return res.json({
//       success: false,
//       message: "Please Provide Course ID",
//     });
//   }

//   //  get userDetails
//   const userDetails = await User.findById(userId);
//   // console.log("printing userDetails :", userDetails);

//   if (!userDetails) {
//     return res.status(404).json({
//       success: false,
//       message: "Cannot get userDetails",
//     });
//   }

//   let total_amount = 0;

//   //  get course id from courses
//   for (const course_id of courses) {
//     let course;

//     //  find course based on cours_id
//     try {
//       course = await Course.findById(course_id);
//       if (!course) {
//         return res.status(200).json({
//           success: false,
//           message: "Could not find the Course",
//         });
//       }

//       // const uid = new mongoose.Types.ObjectId(userId);
//       if (course.studentsEnrolled.includes(userId)) {
//         return res.status(200).json({
//           success: false,
//           message: "Student is already Enrolled",
//         });
//       }

//       total_amount += course.price;
//     } catch (error) {
//       console.log(error);
//       return res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   let request = {
//     order_amount: total_amount,
//     order_currency: "INR",
//     order_id: Math.random().toString(36).substring(2, 15), // Unique order ID
//     customer_details: {
//       customer_id: userId,
//       customer_phone: "6200410024",
//       customer_name: userDetails.firstName,
//       customer_email: userDetails.email,
//     },
//     order_meta: {
//       return_url: `http://localhost:5173/webhook/cashfree?courses=${courses.join(
//         ","
//       )}`,
//     },
//   };

//   try {
//     const paymentResponse = await Cashfree.PGCreateOrder("2023-08-01", request);

//     res.json({
//       success: true,
//       data: paymentResponse.data,
//       message: "Session id Created",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Could not initiate order.",
//     });
//   }
// };

// // Verify Payment
// exports.verifyPayment = async (req, res) => {
//   try {
//     const { courses, cfPaymentId } = req.body;
//     const userId = req.user.id;

//     console.log(
//       "credentials-of verification:",
//       "orderId",
//       cfPaymentId,
//       "courses:",
//       courses,
//       "userId: ",
//       userId
//     );

//     if (!userId || !courses || !cfPaymentId) {
//       return res.status(401).json({
//         success: false,
//         messsage: "unable to get courses and userId",
//       });
//     }

//     const paymentResponse = await Cashfree.PGOrderFetchPayment(
//       "2023-08-01",
//       cfPaymentId
//     );

//     console.log("printing payment respone : ", paymentResponse);

//     if (paymentResponse) {
//       await enrollStudents(courses, userId, res);
//       return res.status(200).json({
//         success: true,
//         message: "Payment Verified successfully",
//         data: paymentResponse,
//       });
//     } else {
//       throw new Error("Payment verification failed");
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Payment verification failed",
//     });
//   }
// };

// //  create a function for enrolling students
// const enrollStudents = async (courses, userId, res) => {
//   //  validate karlo data aya hai ya ni
//   if (!courses || !userId) {
//     return res.status(400).json({
//       success: false,
//       message: "Course and user not found",
//     });
//   }

//   //  students ko enroll kardo course me
//   for (const courseId of courses) {
//     try {
//       const enrollCourses = await Course.findOneAndUpdate(
//         {
//           _id: courseId,
//         },
//         { $push: { studentsEnrolled: userId } },
//         { new: true } // return new doc
//       );

//       // validate kar lo
//       if (!enrollCourses) {
//         return res.status(500).json({
//           success: false,
//           message: "Unable to enrole student into courses",
//         });
//       }

//       //  create course Progress fields in db
//       const courseProgress = await CourseProgress.create({
//         courseID: courseId,
//         userId: userId,
//         completedVideos: [],
//       });

//       //  ab students ki data me courses ko dall do
//       const enrollStudents = await User.findByIdAndUpdate(
//         userId,
//         {
//           $push: {
//             courses: courseId,
//             courseProgress: courseProgress._id,
//           },
//         },
//         { new: true }
//       );

//       //  validate kar lo data ko
//       if (!enrollStudents) {
//         return res.status(400).json({
//           success: false,
//           message: "Unable to add courses to students data",
//         });
//       }

//       // mail send krdo
//       const mailResponse = mailSender(
//         enrollStudents.email,
//         `Successfully enrolled into ${enrollCourses.courseName} `,
//         courseEnrollmentEmail(
//           enrollCourses.courseName,
//           `${enrollStudents.firstName}`
//         )
//       );

//       console.log("email sent successfully", mailResponse);

//       res.status(200).json({
//         success: true,
//         message: "Course enrolled succesfully ",
//       });
//     } catch (err) {
//       console.log(err);
//       res.status(500).json({
//         success: false,
//         message: err.message,
//       });
//     }
//   }
// };

// // Send Payment Success Email
// exports.sendPaymentSuccessEmail = async (req, res) => {
//   const { orderId, paymentId, amount } = req.body;

//   // get user id
//   const userId = req.user.id;

//   // validate data
//   if (!orderId || !paymentId || !amount || !userId) {
//     return res.status(400).json({
//       success: false,
//       message: "Please provide all the details",
//     });
//   }

//   //  get enrolled student data from userId

//   try {
//     const enrolledStudent = await User.findById(userId);

//     //  send a payment succes mail
//     const mailRes = await mailSender(
//       enrolledStudent.email,
//       `Payment Received`,
//       paymentSuccessEmail(
//         `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
//         amount / 100,
//         orderId,
//         paymentId
//       )
//     );

//     //  send success response
//     res.status(200).json({
//       success: true,
//       message: "Payment done and mail send successfully",
//       data: mailRes,
//     });
//   } catch (error) {
//     console.log("error in sending mail", error);
//     return res.status(400).json({
//       success: false,
//       message: "Could not send email",
//     });
//   }
// };

// // const { default: orders } = require("razorpay/dist/types/orders");

// // ***************** these handler are only used to buy single product ,

// // create Payment integration Handler
// // exports.capturePayment = async (req, res) => {
// //   try {
// //     // get course id and user id
// //     const { course_id } = req.body;
// //     const userId = req.user.userId;

// //     // check whether course id is valid or not
// //     if (!course_id) {
// //       return res.status(401).json({
// //         success: false,
// //         message: "Course Id is not valid",
// //       });
// //     }

// //     // check whether the course coming from course_id is valid or not
// //     let course;
// //     try {
// //       course = await Course.findById(course_id);
// //       if (!course) {
// //         return res.status(401).json({
// //           success: false,
// //           message: "course does not exist",
// //         });
// //       }

// //       // check wheher user is enrolled for the course or not
// //       const uid = mongoose.Schema.Types.ObjectId(userId);
// //       if (course.studentsEnrolled.includes(uid)) {
// //         return res.status(200).json({
// //           success: false,
// //           message: "User is already enrolled",
// //         });
// //       }
// //     } catch (err) {
// //       console.log(err);
// //       res.status(408).json({
// //         success: false,
// //         message: err.message,
// //       });
// //     }

// //     // create a order now
// //     try {
// //       // create a payment order
// //       const amount = course.price;
// //       const currency = "INR";

// //       const options = {
// //         amount: amount * 100,
// //         currency,
// //         receipt: Date.now().toString(),
// //         notes: {
// //           course_id,
// //           userId,
// //         },
// //       };

// //       // initiate the payment order
// //       const paymentResponse = await instance.orders.create(options);
// //       console.log(paymentResponse);

// //       return res.status(200).json({
// //         success: true,
// //         courseName: course.courseName,
// //         courseDescription: course.courseDescription,
// //         thumbnail: course.thumbnail,
// //         orderId: paymentResponse.id,
// //         currency: paymentResponse.currency,
// //         amount: paymentResponse.amount,
// //       });

// //       // send a successfull response with success flag
// //     } catch (err) {
// //       console.log("err while initiating order", err);
// //       res.status(402).json({
// //         success: false,
// //         message: "error while initiating ",
// //       });
// //     }
// //   } catch (err) {
// //     console.log("facing issue while capturing payment", err);
// //     res.status(500).json({
// //       success: false,
// //       message: "Cannot capture Payment",
// //     });
// //   }
// // };

// // // verify Signature for authorisation on razorpay
// // exports.verifySignature = async (req, res) => {
// //   try {
// //     // create a webhook secret key
// //     const webhookSecret = "123456";

// //     // get a signature from razorpay
// //     const signature = req.headers["x-razorpay-signature"];

// //     // for matching both razorpay signature and serverWebhook so that authentication is completed you have to encrypt your secKey , cause razorpay signature once encrypted never be decrypted . so encrypt your webhook key

// //     const shasum = crypto.createHmac("sha256", webhookSecret); // returns a object , so convert it in string

// //     shasum.update(JSON.stringify(req.body));
// //     const digest = shasum.digest("hex"); // digest term is used for encrypted format secret key and it contains in hexadecimal code

// //     // payment is authorised, now add course to user dashboard
// //     if (signature === digest) {
// //       console.log("Payment is Authorized");

// //       // after authorisation a response will be sent by razorpay. in which we have sent notes ,while initialising the order , it contains courseid and userid

// //       // extract courseId and userId from response
// //       try {
// //         const { courseId, userId } = req.body.payload.paytment.entity.notes;

// //         // add userId into studedntsEnrolled by searching courseId
// //         const enrolledCourse = await Course.findOneAndUpdate(
// //           { _id: courseId },
// //           {
// //             $push: {
// //               studentsEnrolled: userId,
// //             },
// //           },
// //           { new: true }
// //         );

// //         // check if enrolledCourse comes or not
// //         if (!enrolledCourse) {
// //           return res.status(500).json({
// //             success: false,
// //             message: "Course not found",
// //           });
// //         }
// //         console.log(enrolledCourse);

// //         // add courseId into users enrollment
// //         const enrolledStudent = await User.findOneAndUpdate(
// //           { _id: userId },
// //           {
// //             $push: { courses: courseId },
// //           },
// //           { new: true }
// //         );

// //         console.log(enrolledStudent);

// //         //  Send Enrollment mail
// //         const emailRespnse = await mailSender(
// //           enrolledStudent.email,
// //           "Congratulations from SmartED",
// //           "you are enrolled successfully"
// //         );

// //         console.log(emailRespnse);

// //         // send response
// //         return res.status(200).json({
// //           success: true,
// //           message: "Payment done and enrolled succesfully ",
// //         });
// //       } catch (err) {
// //         console.log(err);
// //         res.status(500).json({
// //           success: false,
// //           message: err.message,
// //         });
// //       }
// //     } else {
// //       res.status(500).json({
// //         success: false,
// //         message: "Invalid request",
// //       });
// //     }
// //   } catch (err) {
// //     console.log("facing issue while verifying signature", err);
// //     res.status(500).json({
// //       success: false,
// //       message: "Unable to verify signature",
// //     });
// //   }
// // };

// // ******************* we want to buy multiple course  by adding product in cart
