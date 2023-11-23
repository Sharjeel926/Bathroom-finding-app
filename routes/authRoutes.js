const express = require("express");
const verificationValidation = require("../validator/verifyValidator");
const route = require("../controller/authenticationControllers/authenticationControllers");
const router = express.Router();
const { check } = require("express-validator");
const verifyToken = require("../middleware/verifyToken");
router.post(
  "/signup",
  [
    // Validation for the phoneNumber field
    check("phoneNumber")
      .notEmpty()
      .withMessage("Phone number is required")
      .isMobilePhone("any", { strictMode: false })
      .withMessage("Invalid phone number format"),
  ],
  route.registration
);

router.post(
  "/signIn",
  [
    // Validation for the phoneNumber field
    check("phoneNumber")
      .notEmpty()
      .withMessage("Phone number is required")
      .isMobilePhone("any", { strictMode: false })
      .withMessage("Invalid phone number format"),
  ],
  route.signIn
);
//, verificationValidation
router.post("/verifySignIn", route.verifySignIn);
router.post("/verifyUser", route.verification);
module.exports = router;
