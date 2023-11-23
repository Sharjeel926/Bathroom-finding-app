//in this i create an array of object in which user has

const mongoose = require("mongoose");
//here we have to make a schema for adding a loo
const bathSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  looPic: {
    String,
  },
  looName: {
    type: String,
    unique: true,
    required: true,
  },
  location: {
    type: {
      type: String,
      default: "Point",
      required: true,
    },

    coordinates: {
      type: [Number],
      required: true,
    },
  },
  address: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  gender: {
    type: [String], // Change to array of strings
    required: true,
    validate: {
      validator: function (value) {
        return value.length >= 1 && value.length <= 3;
      },
      message: "Gender array must have exactly 3 elements",
    },
  },
  anemities: {
    blowDrayer: {
      type: Boolean,
      default: false,
    },
    paperTowel: {
      type: Boolean,
      default: false,
    },
    touchLessPaperTowel: {
      type: Boolean,
      default: false,
    },
    touchLessSoapDispenser: {
      type: Boolean,
      default: false,
    },
    feminineProduct: {
      type: Boolean,
      default: false,
    },
    babyChangingStation: {
      type: Boolean,
      default: false,
    },
  },
  needKey: {
    type: Boolean,
    default: false,
  },
  wheelChair: {
    type: Boolean,
    default: false,
  },
});
bathSchema.index({ location: "2dsphere" });
module.exports = mongoose.model("bathSchema", bathSchema);
