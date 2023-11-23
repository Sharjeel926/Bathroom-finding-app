const user = require("../../models/user");
const fs = require("fs");
const { generateOtp } = require("../../utils/generateOtp");
const otpSchema = require("../../models/otpSchema");
const secretKey = require("../../config/config");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const registration = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(400).json({ errors: errorMessages });
    }

    if (phoneNumber) {
      const existingUser = await user.findOne({ phoneNumber });

      if (existingUser) {
        res.status(400).json({ message: "User already registered" });
      } else {
        const Otp = generateOtp();

        const newOtp = new otpSchema({
          phoneNumber: phoneNumber,
          otp: Otp,
          createdAt: new Date(),
        });
        await newOtp.save();
        const newUser = new user({
          phoneNumber,
          fullName: null,
          DateOfBirth: null,
          Gender: null,
          email: null,
          profilePic: null,
          isverified: false,
        });
        await newUser.save();

        res
          .status(200)
          .json({ message: "Otp is sending to your phone number" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
const verification = async (req, res) => {
  const { otp, phoneNumber } = req.body;
  try {
    const check = await user.findOne({ phoneNumber });
    //return id in response
    if (!check) {
      return res.status(401).json({ message: "First register" });
    } else {
      const checkOtp = await otpSchema.findOne({ phoneNumber });

      if (checkOtp) {
        if (checkOtp.otp === otp) {
          const updateUser = await user.updateOne(
            {
              phoneNumber: check.phoneNumber,
              isVerified: false,
            },
            {
              $set: { isVerified: true },
            }
          );

          if (updateUser) {
            await otpSchema.deleteOne({ phoneNumber });
            res
              .status(200)
              .json({ message: "Verification successful", userId: check._id });
          } else {
            await otpSchema.deleteOne({ phoneNumber });
            res.status(400).json({ message: "Failed to verify" });
          }
        } else {
          res.status(401).json({ message: "Invalid OTP" });
        }
      } else {
        res.status(401).json({ message: "OTP not found" });
      }
    }
  } catch (error) {
    console.error("Error in verification:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const signIn = async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    const existingUser = await user.findOne({ phoneNumber });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const newOtp = generateOtp();

    const otpRecord = new otpSchema({
      phoneNumber,
      otp: newOtp,
      createdAt: new Date(),
    });
    await otpRecord.save();

    res.status(200).json({ message: "OTP sent to your phone number" });
  } catch (error) {
    console.error("Error in signIn:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const verifySignIn = async (req, res) => {
  const { otp, phoneNumber } = req.body;

  try {
    const userCheck = await user.findOne({ phoneNumber });
    if (!userCheck) {
      return res.status(401).json({ message: "User not registered" });
    }

    const otpCheck = await otpSchema.findOne({ phoneNumber, otp });
    if (!otpCheck) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    const token = jwt.sign(
      {
        userId: userCheck._id,
      },
      secretKey.secretKey,
      { expiresIn: "30d" }
    );

    await otpSchema.deleteOne({ phoneNumber });
    return res.status(200).json({
      message: "OTP verified successfully",
      token: token,
      userId: userCheck._id,
    });
  } catch (error) {
    console.error("Error in verifySignIn:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  registration,
  verification,
  signIn,
  verifySignIn,
};
