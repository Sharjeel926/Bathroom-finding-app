const mongoose = require("mongoose");
//const UserSch = require("../models/user");

//const bathSchema = require("../models/bathModel");
//const otpSchema = require("../models/otpSchema");
const dotenv = require("dotenv");
dotenv.config();
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Mongodb connected");
  })
  .catch((error) => {
    console.log(error);
  });
