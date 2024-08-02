const User = require("../models/user");
const Tag = require("../models/category");
const Course = require("../models/course");
const Section = require("../models/section");
const SubSection = require("../models/subSection");
const CourseProgress = require("../models/courseProgress");
require("dotenv").config();
const { uploadImageToCloudinary } = require("../utilities/imageUploader");
const FOLDER_NAME = process.env.FOLDER_NAME;
// create course handler
const mongoose = require("mongoose");
const { convertSecondsToDuration } = require("../utilities/secToDuration");

exports.createCourse = async (req, res) => {
  try {
    // Get user ID from request object
    const userId = req.user.id;

    // Get all required fields from request body
    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag: _tag,
      category,
      status,
      instructions: _instructions,
    } = req.body;
    // Get thumbnail image from request files
    const thumbnail = req.files.thumbnail;

    // Convert the tag and instructions from stringified Array to Array
    const tag = JSON.parse(_tag);
    const instructions = JSON.parse(_instructions);

    // console.log("tag", tag);
    // console.log("instructions", instructions);

    // console.log(
    //   courseName,
    //   courseDescription,
    //   whatYouWillLearn,
    //   price,
    //   tag,
    //   category,
    //   status,
    //   instructions,
    //   thumbnail
    // );

    // Check if any of the required fields are missing
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !thumbnail ||
      !category ||
      !instructions
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Mandatory",
      });
    }
    if (!status || status === undefined) {
      status = "Draft";
    }
    // Check if the user is an instructor
    const instructorDetails = await User.findById(userId, {
      accountType: "Instructor",
    });

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor Details Not Found",
      });
    }

    // Check if the tag given is valid
    const categoryDetails = await Tag.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category Details Not Found",
      });
    }
    // Upload the Thumbnail to Cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      FOLDER_NAME
    );
    // console.log(thumbnailImage);
    // Create a new course with the given details
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      tag,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      status: status,
      instructions,
    });

    // Add the new course to the User Schema of the Instructor
    await User.findByIdAndUpdate(
      {
        _id: instructorDetails._id,
      },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );
    // Add the new course to the Categories
    const categoryDetails2 = await Tag.findByIdAndUpdate(
      { _id: category },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );
    // console.log("HEREEEEEEEE", categoryDetails2);
    // Return the new course and a success message
    res.status(200).json({
      success: true,
      message: "Course Created Successfully",
      data: newCourse,
    });
  } catch (error) {
    // Handle any errors that occur during the creation of the course
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

//  updatecourse
exports.updateCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const updates = req.body;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // If Thumbnail Image is found, update it
    if (req.files) {
      // console.log("thumbnail update");
      const thumbnail = req.files.thumbnailImage;
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        FOLDER_NAME
      );
      course.thumbnail = thumbnailImage.secure_url;
    }

    // Update only the fields that are present in the request body
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (key === "tag" || key === "instructions") {
          course[key] = JSON.parse(updates[key]);
        } else {
          course[key] = updates[key];
        }
      }
    }

    await course.save();

    const updatedCourse = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
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

//  get full course detail when editin the course
exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;
    // console.log("course id: ", courseId);
    const userId = req.user.id;
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    let courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    });

    // console.log("courseProgressCount : ", courseProgressCount);

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      });
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    let totalDurationInSeconds = 0;
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration);
        totalDurationInSeconds += timeDurationInSeconds;
      });
    });

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
      message: "Course Details fetched successfull",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//  delete course
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
        { $pull: { courses: courseId } },
        { new: true }
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
