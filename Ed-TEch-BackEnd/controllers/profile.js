const Profile = require("../models/profile");
const User = require("../models/user");
const { default: mongoose } = require("mongoose");

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
    const profileDetails = await Profile.findById(profileId);

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
exports.getAllUserDetails = async (req, res) => {
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
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Cannot Delete Profile",
    });
  }
};

// upload profile picture
exports.uploadDisplayPicture = async (req, res) => {
  try {
    //take image file from input
    // upload it to cloudinary
    // update on user profile
  } catch (err) {}
};
