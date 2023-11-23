const mongoose = require("mongoose");
const otpSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
  },
  otp: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 120,
  },
});
module.exports = mongoose.model("otpSchema", otpSchema);
