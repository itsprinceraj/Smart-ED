const Profile = require("../models/profile");
const User = require("../models/user");
const { uploadImageToCloudinary } = require("../utilities/imageUploader");
const { default: mongoose } = require("mongoose");
require("dotenv").config();
const FOLDER_NAME = process.env.FOLDER_NAME;
// Create a profile
exports.updateProfile = async (req, res) => {
  try {
    // Get data from req.body
    const { dateOfBirth = "", about = "", gender, contactNumber } = req.body;

    // Get user id from decoded token
    const id = req.user.id;

    // console.log(typeof id, id);

    // Check whether the fields are empty or not
    if (!contactNumber || !gender || !id) {
      return res.status(401).json({
        success: false,
        message: "Please fill all the details",
      });
    }

    // Find profile by using user id
    const userDetails = await User.findById(id);
    // console.log(userDetails);

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User details not found",
      });
    }

    const profileId = userDetails.additionalDetails;
    let profileDetails = await Profile.findById(profileId);

    // Update profile
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.contactNumber = contactNumber;
    profileDetails.gender = gender;

    // console.log(profileDetails.dateOfBirth);

    // Save the updated profileDetails
    const updatedDetails = await profileDetails.save();
    console.log(updatedDetails);

    // Send success response
    res.status(200).json({
      success: true,
      message: "Profile updated Successfully",
      updatedDetails,
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
  // How can we schedule this delete operation
  try {
    // fetch user id
    const id = req.user.id;

    // get userDetails
    const userDetails = await User.findById(id);

    // find and delete profile
    await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });

    // TODO : unenroll user from

    // find and delete user
    await User.findByIdAndDelete({ _id: id });

    // send response
    res.status(200).json({
      success: true,
      message: "Account Deleted Successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Cannot Delete Profile",
    });
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
    console.log(response);
    // update on user profile
    const updatedProfile = await User.findOneAndUpdate(
      { _id: req.user.id }, // user is logged in so, id must be available in req.userid
      { image: response.secure_url },
      { new: true }
    );
    console.log(updatedProfile);

    res.status(200).json({
      status: true,
      message: "Profile picture updated successfully",
      updatedProfile,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: false,
      message: "unable to upload profile picture",
    });
  }
};
