const mongoose = require("mongoose");
require("dotenv").config();
const MONGODB_URL = process.env.MONGODB_URL;

// initiate db
exports.dbConnect = () => {
  mongoose
    .connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("DB connected SuccesFully"))
    .catch((err) => {
      console.log(err);
      console.log("DB connection Failed");
      process.exit(1);
    });
};
