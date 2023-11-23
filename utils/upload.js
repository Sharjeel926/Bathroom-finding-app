const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "image/"); // Specify the directory where image files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, callback) => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif"];
    const checkFile = path.extname(file.originalname).toLowerCase();

    if (imageExtensions.includes(checkFile)) {
      return callback(null, true);
    }
    return callback(new Error("File type not allowed"));
  },
});

module.exports = upload;
