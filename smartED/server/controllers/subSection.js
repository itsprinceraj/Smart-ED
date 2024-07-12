const SubSection = require("../models/subSection");
const Section = require("../models/section");
require("dotenv").config();
const { uploadImageToCloudinary } = require("../utilities/imageUploader");
const { findByIdAndUpdate } = require("../models/user");
require("dotenv").config();
const FOLDER_NAME = process.env.FOLDER_NAME;
// create Subsection

function isFileSupported(type, supportedFormat) {
  return supportedFormat.includes(type);
}

exports.createSubSection = async (req, res) => {
  try {
    // fetch data form req.body
    const { sectionId, title, timeDuration, description, videoUrl } = req.body;

    // check whether it contain empty fields or not
    if (!sectionId || !title || !timeDuration || !description) {
      return res.status(401).json({
        success: false,
        message: "fields are empty",
      });
    }

    // fatch video file form body
    const video = req.files.videoFile;

    //  define validation
    const supportedFormat = ["mp4", "mov", "png", "jpeg", "jpg"];
    const fileType = video.name.split(".")[1].toLowerCase();

    // validation kar lo bhaiya
    if (!isFileSupported(fileType, supportedFormat)) {
      return res.status(400).json({
        success: false,
        message: "video format not supported",
      });
    }

    // file format supported
    // then upload it to cloudinary and create database entry
    const uploadDetails = await uploadImageToCloudinary(video, FOLDER_NAME, {
      quality: 20,
    });

    // Create entry of subSection in DB
    const subSectionDetails = await SubSection.create({
      title: title,
      timeDuration: timeDuration,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });

    // console.log("printin subsection id", subSectionDetails._id);

    // create Section with  subSection Id
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      {
        $push: { subSection: subSectionDetails._id },
      },
      { new: true }
    )
      .populate("subSection")
      .exec();

    // console.log(updatedSection);

    // return response with success flag
    res.status(200).json({
      success: true,
      message: "SubSection Created successfully",
      data: updatedSection,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Unable to create subSection , error occured",
    });
  }
};

// Update SubSection
exports.updateSubSection = async (req, res) => {
  try {
    // fetch data from body
    const { title, subSectionId } = req.body;

    // check whether fields are empty or not
    if (!title || !subSectionId) {
      return res.status(401).json({
        success: false,
        message: "fields are empty",
      });
    }

    // update SubSection
    const newSubSection = await SubSection.findByIdAndUpdate(
      { _id: subSectionId },
      { title: title },
      { new: true }
    );

    res.status(200).json({
      status: true,
      message: "SubSection Updated successfully",
      data: newSubSection,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Cannot Update SubSection",
    });
  }
};

// Delete Sub Section

exports.deleteSubSection = async (req, res) => {
  try {
    // fetch data from req params
    const { subSectionId, sectionId } = req.body;

    //validate
    if (!subSectionId || !sectionId) {
      res.status(400).json({
        status: false,
        message: "Please fill all the fields",
      });
    }

    // find by id and delete
    await SubSection.findByIdAndDelete(subSectionId);

    // remove subsection from section Schema
    await Section.findByIdAndUpdate(
      sectionId,
      {
        $pull: { subSection: subSectionId },
      },
      { new: true }
    );

    // Send Response with a success flag
    res.status(200).json({
      success: true,
      message: "SubSection deleted Successfully ",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Cannot Delete SubSection",
    });
  }
};
