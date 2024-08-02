const express = require("express"); // import express
const app = express(); // take instance of express
require("dotenv").config(); // import dotenv so that we can use all the configurations of environment variables
const cors = require("cors"); // --- Cros Origin Resourse Sharing

//connectivity instance
const { dbConnect } = require("./config/database"); // import dbConnect func. by destructuring it
const fileUpload = require("express-fileupload");
const { cloudinaryConnect } = require("./config/cloudinary");

// imporitng Routes
const userRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profileRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const contactRoutes = require("./routes/contactRoutes");

// import cookie Parser
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT;

// use express middleware to parse json data from req body
app.use(express.json());

// use cookieParser
app.use(cookieParser());

// we want BackEnd to entertain our Frontend so use cors;
const allowedOrigin = ["http://localhost:5173"];
app.use(
  cors({
    origin: allowedOrigin,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

// use fileUpload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./temp/",
  })
);
app.use(express.urlencoded({ extended: true }));

// import and invoke database
dbConnect();

// cloudinary connect
cloudinaryConnect();

//mount routes
app.use("/api/v1/auth/", userRoutes);
app.use("/api/v1/profile/", profileRoutes);
app.use("/api/v1/course/", courseRoutes);
app.use("/api/v1/payment/", paymentRoutes);
app.use("/api/v1/about/", contactRoutes);

// define default routes
app.get("/", (req, res) => {
  res.send(`<h1>This is HomePage on Port ${PORT}</h1>`);
});

// Listen on port
app.listen(PORT, () => console.log(`Server Initiated At: ${PORT}`));
