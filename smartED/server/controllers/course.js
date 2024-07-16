const User = require("../models/user");
const Tag = require("../models/category");
const Course = require("../models/course");
require("dotenv").config();
const { uploadImageToCloudinary } = require("../utilities/imageUploader");
const { isInstructor } = require("../middlewares/authoriseUser");
const FOLDER_NAME = process.env.FOLDER_NAME;
// create course handler
exports.createCourse = async (req, res) => {
  try {
    // fetch data form req body
    const {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag,
      category,
    } = req.body;

    // fetch thumbnail
    const thumbnail = req.files.thumbnail;

    // validate that , the data is present or not
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !thumbnail ||
      !category
    ) {
      return res.status(401).json({
        success: false,
        message: "Please fill all the details",
      });
    }

    // Details has been filled now check for instructer
    const userId = req.user.id;
    const instructerDetails = await User.findById(userId);
    // console.log("instructor Details: ", instructerDetails);

    // check if the instructor details exists or not
    if (!instructerDetails) {
      return res.status(401).json({
        success: false,
        message: "Instructor details not available",
      });
    }

    // check if  same user trying to make same course again ;
    try {
      const existingCourse = await Course.findOne({
        instructor: userId,
        courseName,
      });

      if (existingCourse) {
        return res.status(400).json({
          success: false,
          message: `${courseName} already exists for the same user`,
          data: existingCourse,
        });
      }
    } catch (err) {
      console.log(err);
    }

    // check that the tag is valid or not
    const tagDetails = await Tag.findById(category);
    // console.log("tagDetails: ", tagDetails);
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
      tag: tagDetails.name,
      thumbnail: thumbnailImage.secure_url,
      category: category,
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

    //update tag schema by adding course id to the courses array field
    const categoryDetails2 = await Tag.findByIdAndUpdate(
      { _id: category },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    // send response
    res.status(200).json({
      success: true,
      message: "Course Created Successfully",
      data: newCourse,
      data2: categoryDetails2,
    });
  } catch (err) {
    console.log("error while creating course: ", err);
    res.status(501).json({
      success: false,
      message: "Unable to create Course",
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
      // .populate({
      //   // courseProgress field is not in course Schema ---
      //   path: "courseProgress",
      // })
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
      data: courseDetails,
    });
  } catch (err) {
    console.log("err while getting CourseDatails", err);
    res.status(501).json({
      success: false,
      message: " something went wrong",
    });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const { category } = req.body;
    const userId = req.user.id;

    // validate if userId available or not
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authorised",
      });
    }

    // validation
    if (!courseId) {
      return res.status(401).json({
        success: false,
        message: "Please enter course id",
      });
    }

    // find course by courseId in Course Schema and delete course
    await Course.findByIdAndDelete(courseId);

    // remove course from instructors profile
    const instructerDetails = await User.findById(userId);
    const updatedInstructorDetail = await User.findByIdAndUpdate(
      { _id: instructerDetails._id },
      { $pull: { courses: courseId } },
      { new: true }
    );

    // remove course from tagschema
    const updatedCategory = await Tag.findByIdAndUpdate(
      { _id: category },
      {
        $pull: { courses: courseId },
      },
      { new: true }
    );

    // send success response
    res.status(200).json({
      success: true,
      message: "Course Deleted Successfully ",
      data: updatedInstructorDetail,
      data2: updatedCategory,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Course Deletion Failed ",
    });
  }
};
