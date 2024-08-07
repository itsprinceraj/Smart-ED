const CourseProgress = require("../models/courseProgress");
const Course = require("../models/course");
const Profile = require("../models/profile");
const User = require("../models/user");
const { uploadImageToCloudinary } = require("../utilities/imageUploader");
const { default: mongoose } = require("mongoose");
require("dotenv").config();
const FOLDER_NAME = process.env.FOLDER_NAME;
const { convertSecondsToDuration } = require("../utilities/secToDuration");
// Create a profile
exports.updateProfile = async (req, res) => {
  try {
    // Get data from req.body
    const {
      dateOfBirth = "",
      about = "",
      gender,
      contactNumber,
      firstName = "",
      lastName = "",
    } = req.body;

    // Get user id from decoded token
    const id = req.user.id;

    // console.log(typeof id, id);

    // Check whether the fields are empty or not
    if (!firstName || !lastName || !contactNumber || !gender || !id) {
      return res.status(401).json({
        success: false,
        message: "Please fill all the details",
      });
    }

    // Find profile by using user id
    const userDetails = await User.findById(id);
    // console.log(userDetails);
    const user = await User.findByIdAndUpdate(id, {
      firstName,
      lastName,
    });

    await user.save(); // save the updated data
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User details not found",
      });
    }

    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);

    // Update profile
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.contactNumber = contactNumber;
    profileDetails.gender = gender;

    // console.log(profileDetails.dateOfBirth);

    // Save the updated profileDetails
    await profileDetails.save();

    // Find the updated user details
    const updatedDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();
    // console.log(updatedDetails);

    // Send success response
    res.status(200).json({
      success: true,
      message: "Profile updated Successfully",
      data: updatedDetails,
    });
  } catch (err) {
    console.error(err);
    // Send error response
    return res.status(500).json({
      success: false,
      message: "Cannot update profile",
    });
  }
};

// delete Profile

exports.deleteProfile = async (req, res) => {
  // How can we schedule this delete operation ?
  try {
    //  fetch user id from req
    const id = req.user.id;
    // console.log(id);

    //  get user from database
    const user = await User.findById({ _id: id });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // Delete Assosiated Profile with the User
    await Profile.findByIdAndDelete({
      _id: new mongoose.Types.ObjectId(user.additionalDetails), // additional detail is stored as object id in userProfile so delete it using this syntax
    });
    for (const courseId of user.courses) {
      await Course.findByIdAndUpdate(
        courseId,
        { $pull: { studentsEnroled: id } },
        { new: true }
      );
    }
    // Now Delete User
    await User.findByIdAndDelete({ _id: id });

    //  delete all courseProgress of the user , if exists
    await CourseProgress.deleteMany({ userId: id });
    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "User Cannot be deleted successfully" });
  }
};

// get all user details
exports.getUserDetails = async (req, res) => {
  try {
    // get user data
    const id = req.user.id;

    // find by id and get all user data
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();
    console.log(userDetails);
    // send Response
    res.status(200).json({
      success: true,
      message: "All user Data has Been Fetched",
      userDetails,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "unable to fetch user Details",
    });
  }
};

// upload profile picture

// define a function to check the file format is supported or not
const isFileSupported = (type, supportedFormat) => {
  return supportedFormat.includes(type);
};
exports.uploadDisplayPicture = async (req, res) => {
  try {
    //take image file from input
    const file = req.files.displayPicture;

    // check wether the file format is supported or not
    const supportedFile = ["jpg", "jpeg", "png"];
    const fileType = file.name.split(".")[1].toLowerCase();
    if (!isFileSupported(fileType, supportedFile)) {
      res.status(401).json({
        success: false,
        message: "file format not supported",
      });
    }
    // upload it to cloudinary
    const response = await uploadImageToCloudinary(file, FOLDER_NAME);
    // console.log(response);
    // update on user profile
    const updatedProfile = await User.findOneAndUpdate(
      { _id: req.user.id }, // user is logged in so, id must be available in req.userid
      { image: response.secure_url },
      { new: true }
    );
    // console.log(updatedProfile);

    res.status(200).json({
      success: true,
      message: "Image Updated successfully",
      data: updatedProfile,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: "unable to update Image",
    });
  }
};

// get enrolled courses data
exports.getEnrolledCourses = async (req, res) => {
  try {
    // fetch user id by which we can further fetch their course details
    const userId = req.user.id;

    //  make a db cal and fetch usern with its id
    let userDetails = await User.findOne({ _id: userId })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec();

    //  logic to find total duration and progress of the course
    userDetails = userDetails.toObject();
    var SubsectionLength = 0;
    for (var i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0;
      SubsectionLength = 0;
      for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        totalDurationInSeconds += userDetails.courses[i].courseContent[
          j
        ].subSection.reduce(
          (acc, curr) => acc + parseInt(curr.timeDuration),
          0
        );
        userDetails.courses[i].totalDuration = convertSecondsToDuration(
          totalDurationInSeconds
        );
        SubsectionLength +=
          userDetails.courses[i].courseContent[j].subSection.length;
      }

      //  progress track of the courses
      let courseProgressCount = await CourseProgress.findOne({
        courseID: userDetails.courses[i]._id,
        userId: userId,
      });
      courseProgressCount = courseProgressCount?.completedVideos.length;
      if (SubsectionLength === 0) {
        userDetails.courses[i].progressPercentage = 100;
      } else {
        // To make it up to 2 decimal point
        const multiplier = Math.pow(10, 2);
        userDetails.courses[i].progressPercentage =
          Math.round(
            (courseProgressCount / SubsectionLength) * 100 * multiplier
          ) / multiplier;
      }
    }

    //  validate useDeytails
    if (!userDetails) {
      res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    //  send response with success flag
    res.status(200).json({
      success: true,
      message: `${
        userDetails.courses.length === 0
          ? "Did not purchased any course yet"
          : "Enrolled course fetched successfully"
      }`,
      data: userDetails.courses,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Unable to get enrolled course data",
    });
  }
  // fetch user id
};

//  create instructor Dashboard
exports.instructoDashboard = async (req, res) => {
  //  fetch instructor id from req
  // const { instructor } = req.user.id;

  //  find course associated to instructor
  const courseData = await Course.find({ instructor: req.user.id });
  // console.log("printing courseData: ", courseData);

  if (!courseData)
    return res.status(404).json({
      success: false,
      message: "Instructor not found",
    });

  // find course details and enrolled studens
  const courseDetails = courseData.map((data) => {
    const totalEnrolledStudents = data.studentsEnrolled.length;
    const totalAmountGenerated = totalEnrolledStudents * data.price;

    // create a new object that needs to be shown on the instructors dashboard
    const courseDataStats = {
      _id: data._id,
      courseName: data.courseName,
      courseDescription: data.courseDescription,
      totalEnrolledStudents,
      totalAmountGenerated,
    };

    return courseDataStats;
  });

  // return success response
  res.status(200).json({
    success: true,
    message: "Instructor data fetched Successfully",
    data: courseDetails,
  });
};
