const mongoose = require("mongoose");

const ratSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  bath: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "bathSchema",
  },
  cleanlinessRating: Number,
  qualityRating: Number,
  overallExperienceRating: Number,
  overallExperienceText: String,
});
module.exports = mongoose.model("Review", ratSchema);
