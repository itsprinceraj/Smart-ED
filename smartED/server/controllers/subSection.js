const SubSection = require("../models/subSection");
const Section = require("../models/section");
require("dotenv").config();
const { uploadImageToCloudinary } = require("../utilities/imageUploader");
const FOLDER_NAME = process.env.FOLDER_NAME;
// create Subsection

// function isFileSupported(type, supportedFormat) {
//   return supportedFormat.includes(type);
// }

exports.createSubSection = async (req, res) => {
  try {
    // Extract necessary information from the request body
    const { sectionId, title, description } = req.body;
    const video = req.files.video;

    // Check if all necessary fields are provided
    if (!sectionId || !title || !description || !video) {
      return res
        .status(404)
        .json({ success: false, message: "All Fields are Required" });
    }
    console.log(video);

    // Upload the video file to Cloudinary
    const uploadDetails = await uploadImageToCloudinary(video, FOLDER_NAME);
    console.log(uploadDetails);
    // Create a new sub-section with the necessary information
    const SubSectionDetails = await SubSection.create({
      title: title,
      timeDuration: `${uploadDetails.duration}`,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });

    // console.log("printing id od subsection : ", SubSectionDetails._id);

    // Update the corresponding section with the newly created sub-section
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { $push: { subSection: SubSectionDetails._id } },
      { new: true }
    )
      .populate("subSection")
      .exec();

    console.log("printing updated seciton ......", updatedSection);
    // Return the updated section in the response
    return res.status(200).json({
      success: true,
      message: "Subsection created Successfully",
      data: updatedSection,
    });
  } catch (error) {
    // Handle any errors that may occur during the process
    console.error("Error creating new sub-section:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update SubSection
exports.updateSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId, title, description } = req.body;
    const subSection = await SubSection.findById(subSectionId);

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    if (title !== undefined) {
      subSection.title = title;
    }

    if (description !== undefined) {
      subSection.description = description;
    }
    if (req.files && req.files.video !== undefined) {
      const video = req.files.video;
      const uploadDetails = await uploadImageToCloudinary(video, FOLDER_NAME);
      subSection.videoUrl = uploadDetails.secure_url;
      subSection.timeDuration = `${uploadDetails.duration}`;
    }

    await subSection.save();

    // find updated section and return it
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    );

    console.log("updated section", updatedSection);

    return res.json({
      success: true,
      message: "Section updated successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the section",
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
