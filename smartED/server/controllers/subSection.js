const SubSection = require("../models/subSection");
const Section = require("../models/section");
require("dotenv").config();
const { uploadImageToCloudinary } = require("../utilities/imageUploader");

require("dotenv").config();
const FOLDER_NAME = process.env.FOLDER_NAME;
// create Subsection

function isFileSupported(type, supportedFormat) {
  return supportedFormat.includes(type);
}

exports.createSubSection = async (req, res) => {
  try {
    // fetch data form req.body
    const { sectionId, title, description } = req.body;
    const video = req.files.videoFile;

    // check whether it contain empty fields or not
    if (!sectionId || !title || !description) {
      return res.status(401).json({
        success: false,
        message: "fields are empty",
      });
    }

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
    const uploadDetails = await uploadImageToCloudinary(video, FOLDER_NAME);

    console.log(uploadDetails);

    // Create entry of subSection in DB
    const subSectionDetails = await SubSection.create({
      title: title,
      timeDuration: uploadDetails.timeDuration,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });

    // create Section with  subSection Id
    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
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
    const { sectionId, title, subSectionId, description } = req.body;

    // check whether fields are empty or not
    if (!title || !subSectionId || sectionId || description) {
      return res.status(401).json({
        success: false,
        message: "fields are empty",
      });
    }

    //check if subSection exist in db or not
    const subSection = await SubSection.findById(subSectionId);

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "Subsection Not Found",
      });
    }

    // id title is not undefined the update title

    if (title !== undefined) {
      subSection.title = title;
    }

    // if description is not undefined then update it

    if (description !== undefined) {
      subSection.description = description;
    }

    // check if video file is no  undefined
    if (req.files && req.files.video !== undefined) {
      const video = req.files.video;
      const uploadDetails = await uploadImageToCloudinary(video, FOLDER_NAME);
      subSection.videoUrl = uploadDetails.secure_url;
      subSection.timeDuration = `${uploadDetails.duration}`;
    }

    //  save entrie in DB
    await SubSection.save();

    // find updated section and return it
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    );

    res.status(200).json({
      status: true,
      message: "SubSection Updated successfully",
      data: updatedSection,
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

    // find by id and delete the data
    await SubSection.findByIdAndDelete({ _id: subSectionId });

    // remove subsection from section Schema
    await Section.findByIdAndUpdate(
      sectionId,
      {
        $pull: { subSection: subSectionId },
      },
      { new: true }
    );

    // find updated section and return it
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    );

    // Send Response with a success flag
    res.status(200).json({
      success: true,
      message: "SubSection deleted Successfully ",
      data: updatedSection,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Cannot Delete SubSection",
    });
  }
};
