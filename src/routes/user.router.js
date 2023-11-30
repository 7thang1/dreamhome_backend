const {
  registerUser,
  checkUser,
  loginUser,
  // logoutUser,
  getUserInfor,
  updateUserInfor,
  resetPassword,
} = require("../controllers/user.controller.js");
const express = require("express");
const authenticateJWT = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/checkUser/:email").get(checkUser);
router.route("/login").post(loginUser);
// router.route("/logout").post(authenticateJWT, logoutUser);
router.route("/getUserInfor").get(authenticateJWT, getUserInfor);
router.route("/updateUserInfor").put(authenticateJWT, updateUserInfor);
router.route("/resetPassword").put(authenticateJWT, resetPassword);

module.exports = router;
