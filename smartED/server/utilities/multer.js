const multer = require("multer");

// Set up storage strategy
const storage = multer.memoryStorage(); // Store files in memory for now

// Create an instance of multer with the specified storage
const upload = multer({ storage });

module.exports = upload;
