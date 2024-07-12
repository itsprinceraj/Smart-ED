const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// connect to cloudinary
exports.cloudinaryConnect = async (req, res) => {
  try {
    cloudinary.config({
      // configuring cloudinary to upload media

      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      API_SECRET: process.env.API_SECRET,
    });
  } catch (err) {
    console.log(err);
  }
};
