const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  gender: {
    type: String,
    // required: true,
  },
  dateOfBirth: {
    type: String,
    // required: true,
  },
  about: {
    type: String,
    trim: true,
  },
  contactNumber: {
    type: String,
    // required: true,
    trim: true,
  },
});

// export schema
module.exports = mongoose.model("Profile", profileSchema);
