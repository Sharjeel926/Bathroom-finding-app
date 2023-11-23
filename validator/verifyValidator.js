const { check } = require("express-validator");

const verificationValidation = [
  check("otp")
    .notEmpty()
    .withMessage("OTP is required")
    .isNumeric()
    .withMessage("OTP must be a numeric value"),
  check("phoneNumber")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone("any", { strictMode: false })
    .withMessage("Invalid phone number format"),
];

module.exports = verificationValidation;
