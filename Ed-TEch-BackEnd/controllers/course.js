const User = require("../models/user");
const Tag = require("../models/category");
const Course = require("../models/course");
require("dotenv").config();
const { uploadImageToCloudinary } = require("../utilities/imageUploader");
const FOLDER_NAME = process.env.FOLDER_NAME;
// create course handler
exports.createCourse = async (req, res) => {
  try {
    // fetch data form req body
    const { courseName, courseDescription, whatYouWillLearn, price, tag } =
      req.body;

    // fetch thumbnail
    const thumbnail = req.files.thumbnail;

    // validate that , the data is present or not
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !thumbnail
    ) {
      return res.status(401).json({
        success: false,
        message: "Please fill all the details",
      });
    }

    // Details has been filled now check for instructer
    const userId = req.user.id;
    const instructerDetails = await User.findById(userId);
    console.log("instructor Details: ", instructerDetails);

    // check if the instructor details exists or not
    if (!instructerDetails) {
      return res.status(401).json({
        success: false,
        message: "Instructor details not available",
      });
    }

    // check that the tag is valid or not
    const tagDetails = await Tag.findById(tag);
    console.log("tagDetails: ", tagDetails);
    if (!tagDetails) {
      return res.status(401).json({
        success: false,
        message: "tag details are empty ",
      });
    }

    //upload thumbnail to cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      FOLDER_NAME
    );

    // create course entry in DB
    const newCourse = await Course.create({
      courseName: courseName,
      courseDescription: courseDescription,
      instructor: instructerDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price: price,
      tag: tagDetails._id,
      thumbnail: thumbnailImage.secure_url,
    });

    // put the new created course in instructors course list
    await User.findByIdAndUpdate(
      { _id: instructerDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    //update tag schema
    await Tag.findByIdAndUpdate(
      { _id: instructerDetails._id },
      {
        $push: {
          tags: tagDetails._id,
        },
      },
      { new: true }
    );

    // send response
    res.status(200).json({
      success: true,
      message: "Course Create Successfully",
    });
  } catch (err) {
    console.log("error while creating course: ", err);
    res.status(501).json({
      success: false,
      message: "Unable create Course",
    });
  }
};

// fetch all course
exports.showAllCourses = async (req, res) => {
  try {
    // make a db call to fetch all course data
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
      .populate("instructor")
      .exec();

    console.log("allCourse Data", allCourses);

    // send response
    res.status(200).json({
      success: true,
      message: " Fetched all courses successfully",
      data: allCourses,
    });
  } catch (err) {
    console.log("err while fetching course data", err);
    res.status(501).json({
      success: false,
      message: " something went wrong while fetching course data",
    });
  }
};

// get course Details
exports.getCourseDetails = async (req, res) => {
  try {
    // get courseId so that you can fetch all course data
    const { courseId } = req.body;

    // make a db call to find by course id
    const courseDetails = await Course.find({ _id: courseId })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate({
        path: "courseProgress",
      })
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .populate("ratingAndReviews")
      .populate("category")
      .exec();

    // what if nothing came in courseDetails
    if (!courseDetails) {
      return res.status(409).json({
        success: false,
        message: "did not found any data from the given id",
      });
    }

    // send succesfull response
    res.status(200).json({
      success: true,
      message: "data Found",
    });
  } catch (err) {
    console.log("err while getting CourseDatails", err);
    res.status(501).json({
      success: false,
      message: " something went wrong",
    });
  }
};
