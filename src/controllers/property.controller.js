const mysql = require("mysql2");
const mysql2 = require("mysql2/promise.js");
const bcrypt = require("bcrypt");
const config = require("../config/database.config.js");
const responseMessage = require("../helpers/responseMessage.js");
const generateToken = require("../helpers/authHelpers.js");
const { connect } = require("../routes/user.router.js");

const creatProperty = async (req, res) => {
  try {
    const userID = req.body.userID;
    const {
      name,
      shortDescription,
      detailDescription,
      price,
      provinceCode,
      districtCode,
      wardCode,
      address,
      bedroom,
      bathroom,
      constructionYear,
      parkingSlot,
      postingDate,
      expiryDate,
      ppropertyCategory,
      category,
      area,
      imageUrls,
    } = req.body;
    const connection = mysql.createPool(config);
    const sqlQuery = `CALL sp_insert_property(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    connection.query(
      sqlQuery,
      [
        userID,
        name,
        shortDescription,
        detailDescription,
        price,
        provinceCode,
        districtCode,
        wardCode,
        address,
        bedroom,
        bathroom,
        constructionYear,
        parkingSlot,
        postingDate,
        expiryDate,
        ppropertyCategory,
        category,
        area,
      ],
      (err, result) => {
        if (err) {
          return res
            .status(400)
            .json(responseMessage(err.message, null, "fail", null));
        }
        const property_id = result.flat().property_id;

        const insertImagesQuery = `CALL sp_insert_property_images(?, ?)`;

        connection.query(
          insertImagesQuery,
          [property_id, JSON.stringify(imageUrls)],
          (err) => {
            if (err) {
              return res
                .status(400)
                .json(responseMessage(err.message, null, "fail", null));
            }

            return res
              .status(200)
              .json(responseMessage("Property created", null, "success", null));
          }
        );
      }
    );
  } catch (err) {
    return res
      .status(500)
      .json(responseMessage("Internal Server error", null, "fail", null));
  }
};

module.exports = { creatProperty };
