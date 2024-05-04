const SubSection = require("../models/subSection");
const Section = require("../models/section");
require("dotenv").config();
const { uploadImageToCloudinary } = require("../utilities/imageUploader");
const subSection = require("../models/subSection");

// create Subsection
exports.createSubSection = async (req, res) => {
  try {
    // fetch data form req.body
    const { sectionId, title, timeDuration, description, videoUrl } = req.body;

    // check whether it contain empty fields or not
    if (!sectionId || !title || !timeDuration || !description || !videoUrl) {
      return res.status(401).json({
        success: false,
        message: "fields are empty",
      });
    }

    // fatch video file form body
    const video = req.files.videoFile;

    // upload to cloudinary
    const uploadDetails = await uploadImageToCloudinary(video, {
      uploadOptions,
    });

    // Create entry of subSection in DB
    const subSectionDetails = await SubSection.create({
      title: title,
      timeDuration: timeDuration,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });

    // create Section with  subSection Id
    const updatedSection = (
      await Section.findByIdAndUpdate(
        { _id: sectionId },
        {
          $push: {
            subSection: subSectionDetails._id,
          },
        },
        { new: true }
      )
    )
      .populate(subSection)
      .exec();

    console.log(updatedSection);

    // return response with success flag
    res.status(200).json({
      success: true,
      message: "SubSection Created successfully",
      updatedSection,
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
      subSectionId,
      {
        $push: { title },
      },
      { new: true }
    ); // TODO: Populate if needed
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
    const { subSectionId } = req.params;

    // find by id and delete
    await SubSection.findByIdAndDelete(subSectionId);
    // TODO: do we need to delete Subsection id from section schema

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
