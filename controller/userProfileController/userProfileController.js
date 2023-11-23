const user = require("../../models/user");
const fs = require("fs");
const secretKey = require("../../config/config");
const jwt = require("jsonwebtoken");

const addProfile = async (req, res) => {
  try {
    const { userId, fullName, DateOfBirth, Gender, email } = req.body;

    if (!userId || !fullName || !DateOfBirth || !Gender || !email) {
      return res.status(400).json({ message: "Invalid data provided" });
    }
    const lowerG = Gender.toLowerCase();
    if (!(lowerG == "male" || lowerG == "female" || lowerG == "unisex")) {
      return res.status(401).json({ message: "Enter correct gender" });
    }

    const findUser = await user.findById({ _id: userId });
    const checkVerify = findUser.isVerified;
    if (!checkVerify) {
      return res.status(404).json({
        message: "User not verify. First verify user then add profile",
      });
    }
    if (!findUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const fileBuffer = fs.readFileSync(req.file.path);
    const base64Image = fileBuffer.toString("base64");

    findUser.fullName = fullName;
    findUser.DateOfBirth = DateOfBirth;
    findUser.Gender = Gender;
    findUser.email = email;
    findUser.profilePic = base64Image;

    await findUser.save();
    res.status(200).json({ message: "Data updated successfully" });
  } catch (error) {
    console.error("Error in addProfile:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
const editProfile = async (req, res) => {
  const userId = req.params.id;
  jwt.verify(req.token, secretKey.secretKey, async (err) => {
    if (err) {
      res.status(403).json({ result: "Invalid token" });
    } else {
      try {
        const check = await user.updateOne({ _id: userId }, { $set: req.body });
        if (check) {
          return res.status(401).json({ message: "User updated" });
        } else {
          return res.status(404).json({ message: "User not found" });
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
      }
    }
  });
};
module.exports = {
  addProfile,
  editProfile,
};
