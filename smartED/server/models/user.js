const mongoose = require("mongoose");

// creare user Schema;

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    emum: ["Admin", "Student", "Instructor"],
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  additionalDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Course",
    },
  ],
  courseProgress: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "CourseProgress",
    },
  ],
});

// export schema
module.exports = mongoose.model("User", userSchema);
