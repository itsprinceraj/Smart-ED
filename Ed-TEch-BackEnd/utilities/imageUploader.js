const cloudinary = require("cloudinary").v2;

// create a upload to cloudinary function so that media files can be uploaded to cloudinary
exports.uploadImageToCloudinary = async (file, folder, options) => {
  const defaultOptions = {
    folder: folder,
    resourse_type: "auto",
  };

  const uploadOptions = { ...defaultOptions, ...options };
  console.log(file.tempFilePath);
  return await cloudinary.uploader.upload(file.tempFilePath, uploadOptions);
};
