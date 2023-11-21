const mysql = require("mysql2");
const mysql2 = require("mysql2/promise.js");
const bcrypt = require("bcrypt");
const config = require("../config/database.config.js");
const responseMessage = require("../helpers/responseMessage.js");
const { generateToken, decodeToken } = require("../helpers/authHelpers.js");

const hashPassword = async (userPassword) => {
  var salt = bcrypt.genSaltSync(10);
  return await bcrypt.hash(userPassword, salt);
};

const registerUser = async (req, res) => {
  try {
    const hashedPassword = await hashPassword(req.body.password);
    const connection = mysql.createPool(config);

    let sqlQuery = `CALL sp_create_user(?, ?, ?)`;
    connection.query(
      sqlQuery,
      [req.body.email, req.body.name, hashedPassword],
      function handleQuery(err) {
        if (err) {
          return res
            .status(400)
            .json(responseMessage(err.message, null, "fail", null));
        }
        return res
          .status(200)
          .json(responseMessage("User created", null, "success", null));
      }
    );
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(responseMessage("Internal server error", null, "fail", null));
  }
};

const checkUser = async (req, res) => {
  try {
    const userEmail = req.params.email;
    const connection = await mysql2.createConnection(config);

    const result = await connection.query(
      `CALL sp_check_user_exist('${userEmail}', @user_exists_result)`
    );

    const exist = await connection.query(
      `SELECT @user_exists_result AS user_exists_result`
    );
    connection.end();
    const userExists = exist.slice(0, -1).flat();
    // console.log(userExists);

    return res
      .status(200)
      .json(responseMessage("User checked", null, "success", userExists));
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(responseMessage("Internal server error", null, "fail", null));
  }
};

const loginUser = async (req, res) => {
  try {
    const connection = mysql.createPool(config);
    const sqlQuery = `CALL sp_login_user(?)`;
    connection.query(
      sqlQuery,
      [req.body.email, req.body.password],
      async function handleQuery(err, result) {
        if (err) {
          return res
            .status(400)
            .json(responseMessage(err.sqlMessage, null, "fail", null));
        }

        const userData = result[0].flat();
        if (!userData || userData.length === 0) {
          // User not found
          return res
            .status(404)
            .json(responseMessage("User not found", null, "fail", null));
        }
        // console.log(userData);
        const validPassword = await bcrypt.compare(
          req.body.password,
          userData[0].password == null ? "" : userData[0].password
        );
        // console.log(validPassword);
        if (!validPassword) {
          return res
            .status(404)
            .json(responseMessage("Wrong password", null, "fail", null));
        }
        if (userData && validPassword) {
          const token = generateToken({ userID: userData[0].user_id });

          res.cookie("token", token, {
            httpOnly: true,
            maxAge: 1 * 60 * 60 * 1000, //1h
            secure: false,
            path: "/",
            sameSite: "strict",
          });

          return res.status(200).json(
            responseMessage(
              "Login success",
              {
                token,
              },
              "success",
              null
            )
          );
        }
        return null;
      }
    );
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(responseMessage("Internal server error", null, "Error", null));
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie(token);
    await client.del(req.user.data.toString());
    return res
      .status(200)
      .json(responseMessage("Logout successful", null, "success", null));
  } catch (err) {
    return res
      .status(500)
      .json(responseMessage("Internal Server error", null, "fail", null));
  }
};

const getUserInfor = async (req, res) => {
  try {
    const userId = req.user.data.userID;
    // console.log(userId);
    const connection = mysql.createPool(config);
    const sqlQuery = `CALL sp_get_user_by_id(?)`;
    connection.query(sqlQuery, [userId], function handleQuery(err, result) {
      if (err) {
        return res
          .status(400)
          .json(responseMessage(err.sqlMessage, null, "fail", null));
      }
      const userData = result[0].flat();
      if (!userData || userData.length == 0) {
        // User not found
        return res
          .status(404)
          .json(responseMessage("User not found", null, "fail", null));
      }
      return res
        .status(200)
        .json(responseMessage("User found", userData, "success", null));
    });
  } catch (err) {
    return res
      .status(500)
      .json(responseMessage("Internal Server error", null, "fail", null));
  }
};

const updateUserInfor = async (req, res) => {
  try {
    const userId = req.user.data.userID;
    const { email, name, password, phone, image } = req.body;
    const connection = mysql.createPool(config);
    const sqlQuery = `CALL sp_update_user(?, ?, ?, ?, ?)`;
    connection.query(
      sqlQuery,
      [userId, email, name, phone, image],
      function handleQuery(err, result) {
        if (err) {
          return res
            .status(400)
            .json(responseMessage(err.sqlMessage, null, "fail", null));
        }
        const userData = result[0].flat();
        if (!userData || userData.length == 0) {
          // User not found
          return res
            .status(404)
            .json(responseMessage("User not found", null, "fail", null));
        }
        return res
          .status(200)
          .json(responseMessage("User updated", userData, "success", null));
      }
    );
  } catch (err) {
    return res
      .status(500)
      .json(responseMessage("Internal Server error", null, "fail", null));
  }
};

const resetPassword = async (req, res) => {
  try {
    const userId = req.user.data.userID;
    const password = req.body;
    const hashedPassword = await hashPassword(password);
    const connection = mysql.createPool(config);
    const sqlQuery = `CALL sp_reset_password(?, ?)`;
    connection.query(
      sqlQuery,
      [userId, hashedPassword],
      function handleQuery(err, result) {
        if (err) {
          return res
            .status(400)
            .json(responseMessage(err.sqlMessage, null, "fail", null));
        }
        const userData = result[0].flat();
        if (!userData || userData.length == 0) {
          // User not found
          return res
            .status(404)
            .json(responseMessage("User not found", null, "fail", null));
        }
        return res
          .status(200)
          .json(responseMessage("User updated", userData, "success", null));
      }
    );
  } catch (err) {
    return res
      .status(500)
      .json(responseMessage("Internal Server error", null, "fail", null));
  }
};

module.exports = {
  registerUser,
  checkUser,
  loginUser,
  logoutUser,
  getUserInfor,
  updateUserInfor,
  resetPassword,
};
