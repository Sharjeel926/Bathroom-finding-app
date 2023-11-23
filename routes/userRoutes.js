const express = require("express");
const route = require("../controller/userProfileController/userProfileController");
const upload = require("../utils/upload");
const verifyToken = require("../middleware/verifyToken");
const { check } = require("express-validator");
const router = express.Router();
router.post(
  "/addProfile",
  [
    check("userId").notEmpty().withMessage("User ID is required"),

    check("fullName").notEmpty().withMessage("Full name is required"),

    check("DateOfBirth").notEmpty().withMessage("Date of Birth is required"),

    check("Gender")
      .notEmpty()
      .withMessage("Gender is required")
      .isIn(["male", "female", "unisex"])
      .withMessage("Invalid gender"),

    check("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format"),
  ],

  upload.single("image"),
  route.addProfile
);
router.put("/updateProfile/:id", verifyToken, route.editProfile);
module.exports = router;
