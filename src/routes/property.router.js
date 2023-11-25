const {
  creatProperty,
  getListProperty,
  getUserInterest,
  getDetailProperty,
  getListPropertyByUser,
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
router
  .route("/getdetailproperty/:propertyId")
  .get(authenticateJWT, getDetailProperty);
router
  .route("/getlistpropertybyuser")
  .get(authenticateJWT, getListPropertyByUser);
router.route("/getprovinces").get(getProvinces);
router.route("/getdistricts/:provinceCode").get(getDistricts);
router.route("/getwards/:districtCode").get(getWards);
// router.route("/login").post(loginUser);
// router.route("/logout").post(authenticateJWT, logoutUser);
// router.route("/getUserInfor").get(authenticateJWT, getUserInfor);
// router.route("/updateUserInfor").put(authenticateJWT, updateUserInfor);
// router.route("/resetPassword").put(authenticateJWT, resetPassword);

module.exports = router;
