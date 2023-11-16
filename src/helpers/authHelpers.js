const jwt = require("jsonwebtoken");

const generateToken = (data) => {
  const token = jwt.sign({ data }, process.env.SECRET_KEY, { expiresIn: "1h" });
  return token;
};

module.exports = generateToken;
