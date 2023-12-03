const mysql = require("mysql2/promise");
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
    const connection = await mysql.createConnection(config);
    let sqlQuery = `CALL sp_create_user(?, ?, ?)`;
    const [results] = await connection.query(sqlQuery, [
      req.body.email,
      req.body.name,
      hashedPassword,
    ]);
    connection.end();
    return res
      .status(200)
      .json(responseMessage("User created", null, "success", null));
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
    const connection = await mysql.createConnection(config);

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
    const { email, password } = req.body;
    const connection = await mysql.createConnection(config);

    const [result] = await connection.query(`CALL sp_login_user(?)`, [email]);
    connection.end();
    const userData = result.slice(0, -1).flat();
    // console.log(userData);
    if (!userData || userData.length === 0) {
      return res
        .status(404)
        .json(responseMessage("User not found", null, "fail", null));
    }

    const validPassword = await bcrypt.compare(
      password,
      userData[0].password ?? ""
    );

    if (!validPassword) {
      return res
        .status(404)
        .json(responseMessage("Wrong password", null, "fail", null));
    }

    if (userData && validPassword) {
      const token = generateToken({ userID: userData[0].user_id });

      return res
        .status(200)
        .json(responseMessage("Login success", { token }, "success", null));
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(responseMessage("Internal server error", null, "Error", null));
  }
};

// const logoutUser = async (req, res) => {
//   try {
//     res.clearCookie(token);
//     await client.del(req.user.data.toString());
//     return res
//       .status(200)
//       .json(responseMessage("Logout successful", null, "success", null));
//   } catch (err) {
//     return res
//       .status(500)
//       .json(responseMessage("Internal Server error", null, "fail", null));
//   }
// };

const getUserInfor = async (req, res) => {
  try {
    const userId = req.user.data.userID;
    const connection = await mysql.createConnection(config);
    const [result] = await connection.query(`CALL sp_get_user_by_id(?)`, [
      userId,
    ]);
    connection.end();
    const userData = result.slice(0, -1).flat();

    if (!userData || userData.length === 0) {
      return res
        .status(404)
        .json(responseMessage("User not found", null, "fail", null));
    }

    return res
      .status(200)
      .json(responseMessage("User found", userData, "success", null));
  } catch (err) {
    return res
      .status(500)
      .json(responseMessage("Internal Server error", null, "fail", null));
  }
};

const updateUserInfor = async (req, res) => {
  try {
    const userId = req.user.data.userID;
    const { email, name, phone, role, image } = req.body;

    const connection = await mysql.createConnection(config);

    const [result] = await connection.query(
      `CALL sp_update_user(?, ?, ?, ?, ?, ?)`,
      [userId, email, name, phone, role, image]
    );
    connection.end();
    // const userData = result;
    console.log(userData);
    if (!userData || userData.length === 0) {
      return res
        .status(404)
        .json(responseMessage("User not found", null, "fail", null));
    }

    return res
      .status(200)
      .json(responseMessage("User updated", userData, "success", null));
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(responseMessage("Internal Server error", null, "fail", null));
  }
};

const resetPassword = async (req, res) => {
  try {
    const userId = req.user.data.userID;
    const password = req.body.password;

    const hashedPassword = await hashPassword(password);

    const connection = await mysql.createConnection(config);

    const [result] = await connection.query(`CALL sp_reset_password(?, ?)`, [
      userId,
      hashedPassword,
    ]);
    connection.end();
    const userData = result;

    if (!userData || userData.length === 0) {
      return res
        .status(404)
        .json(responseMessage("User not found", null, "fail", null));
    }

    return res
      .status(200)
      .json(responseMessage("Password updated", userData, "success", null));
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
  // logoutUser,
  getUserInfor,
  updateUserInfor,
  resetPassword,
};
