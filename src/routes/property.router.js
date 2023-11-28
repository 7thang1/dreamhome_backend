const {
  creatProperty,
  getListProperty,
  getUserInterest,
  getListUserInterest,
  updateProperty,
  getListPropertybyCategory,
  getDetailProperty,
  updateStatusProperty,
  getListPropertyByUser,
  insertInterest,
  removeInterest,
  getProvinces,
  getDistricts,
  getWards,
} = require("../controllers/property.controller.js");
const express = require("express");
const authenticateJWT = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.route("/createproperty").post(authenticateJWT, creatProperty);
router.route("/getlistproperty").get(getListProperty);
router.route("/getuserinterest").get(authenticateJWT, getUserInterest);
router.route("/getlistuserinterest").get(authenticateJWT, getListUserInterest);
router.route("/updateproperty").put(authenticateJWT, updateProperty);
router
  .route("/getlistpropertybycategory/:category")
  .get(getListPropertybyCategory);
router
  .route("/getdetailproperty/:propertyId")
  .get(authenticateJWT, getDetailProperty);
router
  .route("/updatestatusproperty")
  .put(authenticateJWT, updateStatusProperty);
router
  .route("/getlistpropertybyuser")
  .get(authenticateJWT, getListPropertyByUser);
router.route("/insertinterest").post(authenticateJWT, insertInterest);
router.route("/removeinterest").post(authenticateJWT, removeInterest);
router.route("/getprovinces").get(getProvinces);
router.route("/getdistricts/:provinceCode").get(getDistricts);
router.route("/getwards/:districtCode").get(getWards);

module.exports = router;
