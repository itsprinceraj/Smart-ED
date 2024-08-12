const express = require("express"); // import express
const app = express(); // take instance of express
require("dotenv").config(); // import dotenv so that we can use all the configurations of environment variables
const jwt = require("jsonwebtoken");
const secKey = process.env.SEC_KEY;
const cors = require("cors"); // --- Cros Origin Resourse Sharing

//  ************imoprt needed things required for google Oauth setup
const Profile = require("./models/profile");
const User = require("./models/user");
//  import passport and session
const session = require("express-session");

const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2");

// **********************GOOGLE AUTH SETUP***********************

//connectivity instance
const { dbConnect } = require("./config/database"); // import dbConnect func. by destructuring it
const fileUpload = require("express-fileupload");
const { cloudinaryConnect } = require("./config/cloudinary");

//  Import credentials from environment variables
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const sessionSecret = process.env.SESSION_SECRET;

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

// use session
// when we login with google , the it will create a unique session id , if we decode that than we can get users complete data
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
  })
);

//  initialize passport with session
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new OAuth2Strategy(
    {
      clientID: clientId,
      clientSecret: clientSecret,
      callbackURL: "/api/v1/auth/google-sign-in",
      scope: ["email", "profile"],
    },
    async (accessToken, refreshToken, profile, done) => {
      // console.log("print profile...: ", profile);
      try {
        const userExists = await User.findOne({ googleId: profile.id });

        if (userExists) {
          // Generate a JWT token if needed
          const token = jwt.sign(
            {
              email: userExists.email,
              id: userExists._id,
              accountType: userExists.accountType,
            },
            secKey,
            { expiresIn: "3d" }
          );

          userExists.token = token;
          userExists.password = undefined; // No password with Google auth

          return done(null, userExists);
        }

        // Create a new profile if user doesn't exist
        const profileDetails = await Profile.create({
          dateOfBirth: null,
          contactNumber: null,
          gender: null,
          about: null,
        });

        // Create a new user
        const newUser = new User({
          firstName: profile?.given_name,
          lastName: "Kumar",
          email: profile?.emails[0]?.value,
          image: profile?.photos[0]?.value,
          googleId: profile?.id,
          accountType: "Student", // Or prompt user for this later
          additionalDetails: profileDetails?._id,
        });

        const savedUser = await newUser.save();

        //  create a payload
        const payload = {
          email: savedUser.email,
          id: savedUser._id,
          accountType: savedUser.accountType,
        };

        // Generate a JWT token if needed
        const token = jwt.sign(payload, secKey, { expiresIn: "3d" });

        savedUser.token = token;
        savedUser.password = undefined; // No password with Google auth

        return done(null, savedUser);
      } catch (error) {
        console.log(error);
        return done(error, null);
      }
    }
  )
);

//To store the data in session, serialize the user
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize the user from the session
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Initialize Google OAuth
app.get(
  "/api/v1/auth/google/",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
app.get(
  "/api/v1/auth/google-sign-in",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    // Handle user data and token generation
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "User data not found",
      });
    }

    // Send a response or redirect
    const token = req.user.token;
    const userData = req.user;

    // Optionally redirect to frontend
    res.redirect(
      `https://smart-ed-frontend.vercel.app/api/v1/auth/google-sign-in?token=${token}&userData=${JSON.stringify(
        userData
      )}`
    );
  }
);

// we want BackEnd to entertain our Frontend so use cors;
const allowedOrigin = ["https://smart-ed-frontend.vercel.app"];
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
