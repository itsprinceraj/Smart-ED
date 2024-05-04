const RatingAndReview = require("../models/ratingAndReview");
const Course = require("../models/course");
const { default: mongoose } = require("mongoose");

// create RatingAndReview
exports.createRating = async (req, res) => {
  try {
    // get user id - Only logined user can give ratings
    const userId = req.user.id;

    //get data from body
    const { courseId, rating, review } = req.body;

    // check if user already enrolled or not
    const courseDetails = await Course.findOne(
      { _id: courseId },
      { studentsEnrolled: { $elemMatch: { $eq: userId } } }
    );

    // if not enrolled tell them to enrol first
    if (!courseDetails) {
      return res.status(409).json({
        success: false,
        message: "User is not enrolled",
      });
    }

    // check if the user already reviewed
    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });

    // check already reviewed or not
    if (alreadyReviewed) {
      return res.status(409).json({
        success: false,
        message: "user already reviewed",
      });
    }

    // create rating entry in DataBase
    const ratingReview = await RatingAndReview.create({
      user: userId,
      course: courseId,
      rating,
      review,
    });

    // update the course
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      {
        _id: courseId,
      },
      {
        $push: {
          ratingAndReviews: ratingReview._id,
        },
      },
      { new: true }
    );

    console.log(updatedCourseDetails);

    // send success response
    res.status(200).json({
      success: true,
      message: "Rating Created",
      data: reviewed,
    });
  } catch (err) {
    console.log("error while fetching ratings", err);
    res.status(500).json({
      success: false,
      message: "Something Went Wrong",
    });
  }
};

// get average RatingAndReview
exports.getAverageRating = async (req, res) => {
  try {
    // fetch courseId from req.body
    const { courseId } = req.body;

    //now use aggregate methods to calculate average rating and return the response
    const result = await RatingAndReview.aggregate([
      {
        $match: {
          course: mongoose.Schema.Types.ObjectId(courseId),
        },
      },
      { $group: { _id: null, averageRating: { $avg: "$rating" } } }, //there is only one group of id , thats why arayy is of only one element .
    ]);

    // if result does not return anything then return 0
    if (result.length > 0) {
      return res.status(20).json({
        success: true,
        averageRating: result[0].averageRating,
      });
    }

    // if no rating exists
    res.status(200).json({
      success: true,
      messsage: "No rating given ",
      averageRating: 0,
    });
  } catch (err) {
    console.log("error while fetching average ratings", err);
    res.status(500).json({
      success: false,
      message: "Something Went Wrong",
    });
  }
};

// get all RatingAndReview
exports.getAllRating = async (req, res) => {
  try {
    // get all rating by using find mehtod
    const allReviews = await RatingAndReview.find({})
      .sort({ rating: "desc" })
      .populate({
        path: "user",
        select: "firstName lastName email image", // we can choose which fields we want in output
      })
      .populate({
        path: "course",
        select: "courseName",
      })
      .exec();

    // return response
    return res.status(200).json({
      success: true,
      message: "All ratings fetched successfully",
      data: allReviews,
    });
  } catch (err) {
    console.log("error while fetching all ratings", err);
    res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};
