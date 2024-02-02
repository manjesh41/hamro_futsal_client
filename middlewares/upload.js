// const multer = require("multer");

// // Set storage engine
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // Specify the destination folder where the files will be saved
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname); // Generate a unique filename for the uploaded file
//   },
// });

// // Create the multer instance and specify the storage options
// const upload = multer({
//   storage: storage,
// });

// module.exports = { upload };
