const {
  registerUser,
  checkUser,
  loginUser,
  logoutUser,
} = require("../controllers/user.controller.js");
const express = require("express");
const authenticateJWT = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/checkUser/:userEmail").get(checkUser);
router.route("/login").post(loginUser);
router.route("/logout").post(authenticateJWT, logoutUser);

module.exports = router;
