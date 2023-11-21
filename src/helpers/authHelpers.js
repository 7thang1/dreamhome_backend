const jwt = require("jsonwebtoken");

const generateToken = (data) => {
  const token = jwt.sign({ data }, process.env.SECRET_KEY, { expiresIn: "1h" });
  return token;
};

const decodeToken = (token) => {
  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  return decoded;
};

module.exports = { generateToken, decodeToken };
