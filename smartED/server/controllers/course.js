const User = require("../models/user");
const Tag = require("../models/category");
const Course = require("../models/course");
const Section = require("../models/section");
const SubSection = require("../models/subSection");
require("dotenv").config();
const { uploadImageToCloudinary } = require("../utilities/imageUploader");
const { isInstructor } = require("../middlewares/authoriseUser");
const FOLDER_NAME = process.env.FOLDER_NAME;
// create course handler
const mongoose = require("mongoose");

exports.createCourse = async (req, res) => {
  try {
    // Fetch data from req body
    const {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag,
      category,
    } = req.body;

    // Fetch thumbnail
    const thumbnail = req.files.thumbnail;

    // Validate that all the necessary data is present
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

    // Get the user ID from the request
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);

    // Check if the instructor details exist
    if (!instructorDetails) {
      return res.status(401).json({
        success: false,
        message: "Instructor details not available",
      });
    }

    // Check if the same course already exists for the same user
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

    // Check that the tag is valid
    const tagDetails = await Tag.findOne({ _id: category });
    if (!tagDetails) {
      return res.status(401).json({
        success: false,
        message: "Tag details are invalid",
      });
    }

    // Upload thumbnail to Cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      FOLDER_NAME
    );

    // Create course entry in DB
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      price,
      tag: tagDetails.name,
      thumbnail: thumbnailImage.secure_url,
      category,
    });

    // Add the new course to the instructor's course list
    await User.findByIdAndUpdate(
      instructorDetails._id,
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    // Update tag schema by adding course ID to the courses array field
    const updatedTag = await Tag.findByIdAndUpdate(
      category,
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    // Send response
    res.status(200).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
      updatedTag,
    });
  } catch (err) {
    console.log("Error while creating course: ", err);
    res.status(500).json({
      success: false,
      message: "Unable to create course",
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

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentsEnrolled;
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      });
    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent;
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId);
      if (section) {
        const subSections = section.subSection;
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId);
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId);
    }

    // Remove the course ID from the tag(s)
    const tags = course.tag;
    for (const tagName of tags) {
      await Tag.findOneAndUpdate(
        { name: tagName },
        { $pull: { courses: courseId } }
      );
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

//  get all instructor courses
exports.getInstructorCourses = async (req, res) => {
  try {
    //  get instructor id from authenticated user (req.user.id)
    const intructorId = req.user.id;

    // make a db call to fetch course data with this instructor id
    const instructorCourse = await Course.find({
      instructor: intructorId,
    }).sort({ createdAt: -1 });

    // send success response and return the courses
    res.status(200).json({
      success: true,
      message: "Instructor course fetched Successfully",
      data: instructorCourse,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Unable to get instructor courses",
    });
  }
};
