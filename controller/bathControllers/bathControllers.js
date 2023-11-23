const review = require("../../models/rating");
const bath = require("../../models/bathSchema");
const secretKey = require("../../config/config");
const jwt = require("jsonwebtoken");
const user = require("../../models/user");
const config = require("../../config/config");
const { validationResult } = require("express-validator");

const nearByLoo = async (req, res) => {
  const maxDistance = 50000;

  jwt.verify(req.token, secretKey.secretKey, async (err) => {
    if (err) {
      res.status(403).json({ result: "Invalid token" });
    } else {
      try {
        const { longitude, latitude, gender } = req.body;

        if (!longitude || !latitude || !Array.isArray(gender)) {
          return res.status(400).json({ message: "Missing parameters" });
        }

        const parselog = parseFloat(longitude);
        const parselat = parseFloat(latitude);

        const nearBath = await bath.aggregate([
          {
            $geoNear: {
              near: { type: "Point", coordinates: [parselog, parselat] },
              distanceField: "dist.calculated",
              maxDistance: maxDistance,
              spherical: true,
            },
          },
          {
            $match: {
              gender: { $in: gender },
            },
          },
          {
            $project: {
              _id: 0,
              looName: 1,
              location: 1,
              description: 1,
              gender: 1,
              anemities: 1,
              needKey: 1,
              wheelChair: 1,
              distanceInKm: { $divide: ["$dist.calculated", 1000] },
            },
          },
        ]);

        res.status(200).json(nearBath);
      } catch (error) {
        console.error("Error in nearByLoo:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });
};

const findExactLoo = async (req, res) => {
  jwt.verify(req.token, secretKey.secretKey, async (err) => {
    if (err) {
      res.status(403).json({ result: "Invalid token" });
    } else {
      const { looName } = req.body;
      if (!looName) {
        return res.status(400).json({ message: "Missing parameters" });
      }
      try {
        const check = await bath.find(
          { looName: { $regex: new RegExp(looName), $options: "i" } },
          { _id: 0, user: 0 }
        );

        if (check) {
          res.status(200).json({ data: check });
        } else {
          res.status(401).json({ message: "Data not retrieved successfully" });
        }
      } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
      }
    }
  });
};

const writeReviews = async (req, res) => {
  jwt.verify(req.token, secretKey.secretKey, async (err) => {
    if (err) {
      res.status(403).json({ result: "Invalid token" });
    } else {
      const {
        userId, //this is the id of the user which gives the review
        bathId,
        cleanlinessRating,
        qualityRating,
        overallExperienceRating,
        overallExperienceText,
      } = req.body;

      if (
        !cleanlinessRating ||
        !qualityRating ||
        !overallExperienceRating ||
        !overallExperienceText
      ) {
        return res.status(400).json({ message: "Missing parameters" });
      }

      // Validate if userId is a valid ObjectId
      if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).json({ message: "Invalid userId format" });
      }

      try {
        const checkUser = await user.findById(userId);
        if (!checkUser) {
          return res.status(404).json({ message: "User not found" });
        }

        const checkBath = await bath.findById(bathId);
        if (!checkBath) {
          return res.status(404).json({ message: "Bath is not found" });
        }

        const final = new review({
          user: userId,
          bath: bathId,
          cleanlinessRating,
          qualityRating,
          overallExperienceRating,
          overallExperienceText,
        });

        await final.save();
        res.status(201).json({ message: "Reviews are successfully added" });
      } catch (error) {
        console.error("Error in writeReviews:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });
};

const myAddedloo = async (req, res) => {
  jwt.verify(req.token, secretKey.secretKey, async (err) => {
    if (err) {
      res.status(403).json({ result: "Invalid token" });
    } else {
      try {
        const {
          userId,
          looName,
          location,
          address,
          description,
          gender,
          needKey,
          wheelChair,
        } = req.body;

        const {
          blowDrayer,
          paperTowel,
          touchLessPaperTowel,
          touchLessSoapDispenser,
          feminineProduct,
          babyChangingStation,
        } = req.body.anemities;
        const errors = validationResult(req);
        const checkName = await bath.find({ looName });
        if (checkName.length > 0) {
          return res
            .status(400)
            .json({ message: "Bathroom already added with this name" });
        }

        if (
          !userId ||
          !looName ||
          !location ||
          !address ||
          !description ||
          !gender ||
          needKey === undefined ||
          wheelChair === undefined ||
          blowDrayer === undefined ||
          paperTowel === undefined ||
          touchLessPaperTowel === undefined ||
          touchLessSoapDispenser === undefined ||
          feminineProduct === undefined ||
          babyChangingStation === undefined
        ) {
          return res.status(400).json({
            message:
              "Invalid data provided. Please provide all required parameters.",
          });
        }
        const validGenders = ["male", "female", "unisex"];
        if (!gender.every((g) => validGenders.includes(g.toLowerCase()))) {
          return res.status(401).json({ message: "Enter correct gender" });
        }
        ///let base64Image;

        const check = await user.findById(userId);
        // const lowerG = gender.toLowerCase();
        //if (!(lowerG == "male" || lowerG == "female" || lowerG == "unisex")) {
        //return res.status(401).json({ message: "Enter correct gender" });
        // }

        if (!check) {
          return res.status(404).json({
            message:
              "User not found. First register yourself then add your bath",
          });
        } else {
          const addBath = new bath({
            user: userId,
            // looPic: base64Image,
            looName,
            location,
            address,
            description,
            gender,
            anemities: {
              blowDrayer,
              paperTowel,
              touchLessPaperTowel,
              touchLessSoapDispenser,
              feminineProduct,
              babyChangingStation,
            },
            needKey,
            wheelChair,
          });

          await addBath.save();
          res.status(200).json({ message: "Data updated successfully" });
        }
      } catch (error) {
        console.error("Error in myAddedloo:", error);
        res.status(500).json({ message: "Internal server error." });
      }
    }
  });
};

const filter = async (req, res) => {
  jwt.verify(req.token, secretKey.secretKey, async (err) => {
    if (err) {
      res.status(403).json({ result: "Invalid token" });
    } else {
      const filter_bath = [];
      const {
        anemities: {
          blowDrayer,
          paperTowel,
          touchLessPaperTowel,
          touchLessSoapDispenser,
          feminineProduct,
          babyChangingStation,
        },
        needKey,
        wheelChair,
      } = req.body;

      const documents = await bath.find();

      let bathroomsFound = false;

      documents.forEach((document) => {
        const anemitiesMatch =
          document.anemities.blowDrayer === blowDrayer &&
          document.anemities.paperTowel === paperTowel &&
          document.anemities.touchLessPaperTowel === touchLessPaperTowel &&
          document.anemities.touchLessSoapDispenser == touchLessSoapDispenser &&
          document.anemities.feminineProduct === feminineProduct &&
          document.anemities.babyChangingStation === babyChangingStation;
        const other =
          document.needKey === needKey && document.wheelChair === wheelChair;

        if (anemitiesMatch && other) {
          filter_bath.push(document);
          bathroomsFound = true; // Set flag to true if any bathrooms are found
        }
      });

      if (bathroomsFound) {
        res.status(200).json({ filter_bath });
      } else {
        res.status(400).json({ message: "No bathroom found" });
      }
    }
  });
};

const editlooDetail = async (req, res) => {
  //here is only 1 issue of anemities
  const bathId = req.params.id;
  jwt.verify(req.token, secretKey.secretKey, async (err) => {
    if (err) {
      res.status(403).json({ result: "Invalid token" });
    } else {
      try {
        const result = await bath.updateOne(
          { _id: bathId },
          { $set: req.body }
        );

        if (result) {
          return res.status(200).json({ message: "Bathroom updated" });
        } else {
          return res.status(404).json({ message: "Bath not found" });
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
      }
    }
  });
};

const showUserWash = async (req, res) => {
  const userId = req.params.id;
  jwt.verify(req.token, secretKey.secretKey, async (err) => {
    if (err) {
      res.status(403).json({ result: "Invalid token" });
    } else {
      try {
        const userCheck = await user.findById(userId);

        if (!userCheck) {
          return res.status(404).json({ message: "User not found" });
        }

        const batharr = await bath.find({ user: userId });
        const bathIdArr = batharr.map((doc) => doc._id).toString();

        /// console.log("Bath IDs:", bathIdArr);
        let totalqualityRating = 0;
        let count = 0;
        const getReview = await review.find();
        getReview.forEach((document) => {
          if (bathIdArr.includes(document.bath.toString())) {
            totalqualityRating += document.qualityRating;
            count += 1;
          }

          //console.log(document.qualityRating);
        });
        const averageQualityRating = count > 0 ? totalqualityRating / count : 0;

        console.log("Average qualityRating", averageQualityRating);
        //({ bath: { $in: bathIdArr } });
        const batharrWithAverage = batharr.map((bath) => ({
          ...bath.toObject(),
          averageQualityRating,
        }));
        // console.log("Reviews:", getReview); //average

        res.status(200).json({ batharr: batharrWithAverage });
      } catch (error) {
        console.error("Error in showUserWash:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });
};
module.exports = {
  myAddedloo,
  nearByLoo,
  findExactLoo,
  filter,
  writeReviews,
  editlooDetail,
  showUserWash,
};
