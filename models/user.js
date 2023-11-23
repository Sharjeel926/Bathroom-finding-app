const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  phoneNumber: String,
  fullName: String,
  DateOfBirth: Date,
  Gender: [String],
  email: String,
  profilePic: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
});
module.exports = mongoose.model("UserSch", UserSchema);
