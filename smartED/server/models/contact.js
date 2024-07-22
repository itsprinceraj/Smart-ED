const mongoose = require("mongoose");

// create a contact schema
const constactSchema = new mongoose.Schema({
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  email: {
    type: String,
  },
  message: {
    type: String,
  },
  phoneNo: {
    type: String,
  },
  countrycode: {
    type: String,
  },
});

//  export the Schema
module.exports = mongoose.model("ContactUs", constactSchema);
