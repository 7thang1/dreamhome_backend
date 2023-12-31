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
router.route("/getuserinfor").get(authenticateJWT, getUserInfor);
router.route("/updateuserinfor").put(authenticateJWT, updateUserInfor);
router.route("/updatepassword").put(authenticateJWT, resetPassword);

module.exports = router;
