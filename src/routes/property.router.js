const { creatProperty } = require("../controllers/property.controller.js");
const express = require("express");
const authenticateJWT = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.route("/createproperty").post(authenticateJWT, creatProperty);
// router.route("/checkUser/:email").get(checkUser);
// router.route("/login").post(loginUser);
// router.route("/logout").post(authenticateJWT, logoutUser);
// router.route("/getUserInfor").get(authenticateJWT, getUserInfor);
// router.route("/updateUserInfor").put(authenticateJWT, updateUserInfor);
// router.route("/resetPassword").put(authenticateJWT, resetPassword);

module.exports = router;
