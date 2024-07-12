const mongoose = require("mongoose");
require("dotenv").config();
const MONGODB_URL = process.env.MONGODB_URL;

// initiate db
exports.dbConnect = () => {
  // create a dbConnect func and export it
  mongoose
    .connect(MONGODB_URL, {
      // use connect method of mongoose to connect with database;
      // useNewUrlParser: true, //The MongoDB Node.js driver originally had its own URL parser that had certain limitations and did not fully comply with the official MongoDB connection string specification. useNewUrlParser: true tells the driver to use the new, more spec-compliant URL parser.
      // useUnifiedTopology: true, // he unified topology engine was introduced in the MongoDB Node.js driver to provide a more consistent and reliable way to manage connections;
    }) // this method returns a promise so that we must have to manage it ;
    .then(() => console.log("DB connected SuccesFully"))
    .catch((err) => {
      console.log(err);
      console.log("DB connection Failed");
      process.exit(1); // this is for os to tell them that if any error occurs than exit with this error code;
    });
};
