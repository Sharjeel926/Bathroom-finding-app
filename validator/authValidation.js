const { body, validationResult } = require("express-validator");
const phoneValidation = () => {
  return [
    body("phoneNumber")
      .notEmpty()
      .withMessage("Phone number is must")
      .isMobilePhone("any", { strictMode: false })
      .withMessage("Invalid phone number format"),
  ];
};
module.exports = {
  phoneValidation,
};
