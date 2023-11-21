const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const corsOptions = require("./src/middlewares/corsMiddleware.js");
const authenticateJWT = require("./src/middlewares/authMiddleware.js");
require("dotenv").config();
const config = require("./src/config/database.config.js");

const app = express();
const port = process.env.PORT || 5000;

// const connection = mysql.createConnection(config);
// connection.connect((err) => {
//   if (err) throw err;
//   console.log("Connected!");
// });

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/user", require("./src/routes/user.router.js"));
app.use("/property", require("./src/routes/property.router.js"));
app.use(authenticateJWT);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
