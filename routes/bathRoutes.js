const express = require("express");
const route = require("../controller/bathControllers/bathControllers");
const upload = require("../utils/upload");
const router = express.Router();
const { check } = require("express-validator");
const verifyToken = require("../middleware/verifyToken");
router.post(
  "/myAddedloo",
  verifyToken,
  upload.single("image"),
  [
    check("userId").isMongoId().notEmpty(),
    check("looName")
      .notEmpty()
      .custom(async (value) => {
        // Check if looName is unique
        const existingLoo = await bath.findOne({ looName: value });
        if (existingLoo) {
          throw new Error("LooName must be unique");
        }
        return true;
      }),
    check("location").notEmpty(),
    check("address").notEmpty(),
    check("description").notEmpty(),
    check("gender").isIn(["male", "female", "unisex"]).notEmpty(),
    check("needKey").isBoolean(),
    check("wheelChair").isBoolean(),
    check("anemities.blowDrayer").isBoolean(),
    check("anemities.paperTowel").isBoolean(),
    check("anemities.touchLessPaperTowel").isBoolean(),
    check("anemities.touchLessSoapDispenser").isBoolean(),
    check("anemities.feminineProduct").isBoolean(),
    check("anemities.babyChangingStation").isBoolean(),
  ],
  route.myAddedloo
);
router.get("/nearByLoo", verifyToken, route.nearByLoo);
router.post("/findExact", verifyToken, route.findExactLoo);
router.post("/filter_bath", verifyToken, route.filter);
router.post("/writeReviews", verifyToken, route.writeReviews);

router.put("/updateBath/:id", verifyToken, route.editlooDetail);
router.get("/getUserWash/:id", verifyToken, route.showUserWash);

module.exports = router;
