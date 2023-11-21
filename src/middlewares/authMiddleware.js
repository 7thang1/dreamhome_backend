const jwt = require("jsonwebtoken");
const responseMessage = require("../helpers/responseMessage.js");
const secretKey = process.env.SECRET_KEY || "dreamhome_secret";

const authenticateJWT = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res
      .status(401)
      .json(responseMessage("Unauthorized", null, "fail", null));
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res
          .status(401)
          .json(responseMessage("Unauthorized access", null, "fail", null));
      } else {
        console.error("JWT Verification Error:", err); // Log the error for debugging
        return res
          .status(403)
          .json(responseMessage("Forbidden", null, "fail", null));
      }
    }
    req.user = user;
    // console.log(user);
    next();
  });
};

module.exports = authenticateJWT;
