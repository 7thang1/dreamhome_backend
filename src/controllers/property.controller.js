const mysql = require("mysql2");
const config = require("../config/database.config.js");
const responseMessage = require("../helpers/responseMessage.js");

const creatProperty = async (req, res) => {
  try {
    const userID = req.user.data.userID;
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
      propertyCategory,
      category,
      area,
      imageUrls,
    } = req.body;
    const connection = mysql.createPool(config);
    const sqlQuery = `CALL sp_insert_property(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
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
        propertyCategory,
        category,
        area,
      ],
      (err, result) => {
        if (err) {
          return res
            .status(400)
            .json(responseMessage(err.message, null, "fail", null));
        }
        const data = result[0].map((item) => item.property_id);
        console.log(data);
        const property_id = data.flat();
        console.log(property_id);
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

const getListProperty = async (req, res) => {
  try {
    const pageNumber = req.query.pageNumber;
    const pageSize = 16;

    const connection = mysql.createPool(config);
    const sqlQuery = `CALL sp_get_list_property(?, ?)`;
    connection.query(sqlQuery, [pageNumber, pageSize], (err, result) => {
      if (err) {
        return res
          .status(400)
          .json(responseMessage(err.message, null, "fail", null));
      }
      const properties = result[0].flat();
      if (!properties || properties.length == 0) {
        // Property not found
        return res
          .status(404)
          .json(responseMessage("Property not found", null, "fail", null));
      }
      return res
        .status(200)
        .json(responseMessage("Property found", properties, "success", null));
    });
  } catch (err) {
    return res
      .status(500)
      .json(responseMessage("Internal Server error", null, "fail", null));
  }
};

const getUserInterest = async (req, res) => {
  try {
    const userId = req.user.data.userID;
    const connection = mysql.createPool(config);
    const sqlQuery = `CALL sp_get_interest_list(?)`;
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
          .json(responseMessage("List not found", null, "fail", null));
      }
      return res
        .status(200)
        .json(responseMessage("User interest list", userData, "success", null));
    });
  } catch (err) {
    return res
      .status(500)
      .json(responseMessage("Internal Server error", null, "fail", null));
  }
};

const getListUserInterest = async (req, res) => {
  try {
    const userId = req.user.data.userID;
    const connection = mysql.createPool(config);
    const sqlQuery = `CALL sp_get_list_property_interest_by_user(?)`;
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
          .json(responseMessage("List not found", null, "fail", null));
      }
      return res
        .status(200)
        .json(responseMessage("User interest list", userData, "success", null));
    });
  } catch (err) {
    return res
      .status(500)
      .json(responseMessage("Internal Server error", null, "fail", null));
  }
};

const updateProperty = async (req, res) => {
  try {
    const userId = req.user.data.userID;
    const {
      propertyId,
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
      propertyCategory,
      category,
      area,
      imageUrls,
    } = req.body;
    const connection = mysql.createPool(config);
    const sqlQuery = `CALL sp_update_property(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    connection.query(
      sqlQuery,
      [
        userId,
        propertyId,
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
        propertyCategory,
        category,
        area,
      ],
      (err, result) => {
        if (err) {
          return res
            .status(400)
            .json(responseMessage(err.message, null, "fail", null));
        }

        const data = result[0].map((item) => item.property_id);
        const property_id = data.flat();
        const imageUrlsQuery = `CALL sp_update_property_images(?, ?)`;
        connection.query(imageUrlsQuery, [property_id, imageUrls], (err) => {
          if (err) {
            return res
              .status(400)
              .json(responseMessage(err.message, null, "fail", null));
          }

          return res
            .status(200)
            .json(responseMessage("Property updated", null, "success", null));
        });
      }
    );
  } catch (err) {
    return res
      .status(500)
      .json(responseMessage("Internal Server error", null, "fail", null));
  }
};

const getListPropertyByUser = async (req, res) => {
  try {
    const userId = req.user.data.userID;
    const connection = mysql.createPool(config);
    const sqlQuery = `CALL sp_get_list_property_by_user(?)`;
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
          .json(responseMessage("List not found", null, "fail", null));
      }
      return res
        .status(200)
        .json(responseMessage("User interest list", userData, "success", null));
    });
  } catch (err) {
    return res
      .status(500)
      .json(responseMessage("Internal Server error", null, "fail", null));
  }
};

const getDetailProperty = async (req, res) => {
  try {
    const propertyId = req.params.propertyId;
    const connection = mysql.createPool(config);
    const sqlQuery = `CALL sp_get_detail_property(?)`;
    connection.query(sqlQuery, [propertyId], function handleQuery(err, result) {
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
          .json(responseMessage("Property not found", null, "fail", null));
      }
      return res
        .status(200)
        .json(responseMessage("Property detail", userData, "success", null));
    });
  } catch (err) {
    return res
      .status(500)
      .json(responseMessage("Internal Server error", null, "fail", null));
  }
};

// const deleteProperty = async (req, res) => {};
const insertInterest = async (req, res) => {
  try {
    const userId = req.user.data.userID;
    const propertyId = req.body.propertyId;
    const connection = mysql.createPool(config);
    const sqlQuery = `CALL sp_insert_interest(?, ?)`;
    connection.query(
      sqlQuery,
      [userId, propertyId],
      function handleQuery(err, result) {
        if (err) {
          return res
            .status(400)
            .json(responseMessage(err.sqlMessage, null, "fail", null));
        }
        return res
          .status(200)
          .json(responseMessage("Insert interest", null, "success", null));
      }
    );
  } catch (err) {
    return res
      .status(500)
      .json(responseMessage("Internal Server error", null, "fail", null));
  }
};

const removeInterest = async (req, res) => {
  try {
    const userId = req.user.data.userID;
    const propertyId = req.body.propertyId;
    const connection = mysql.createPool(config);
    const sqlQuery = `CALL sp_remove_interest(?, ?)`;
    connection.query(
      sqlQuery,
      [userId, propertyId],
      function handleQuery(err, result) {
        if (err) {
          return res
            .status(400)
            .json(responseMessage(err.sqlMessage, null, "fail", null));
        }
        return res
          .status(200)
          .json(responseMessage("Remove interest", null, "success", null));
      }
    );
  } catch (err) {
    return res
      .status(500)
      .json(responseMessage("Internal Server error", null, "fail", null));
  }
};

const getProvinces = async (req, res) => {
  try {
    const connection = mysql.createPool(config);
    const sqlQuery = `CALL sp_get_province_list()`;
    connection.query(sqlQuery, [], function handleQuery(err, result) {
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
          .json(responseMessage("Provinces not found", null, "fail", null));
      }
      return res
        .status(200)
        .json(responseMessage("Provinces", userData, "success", null));
    });
  } catch (err) {
    return res
      .status(500)
      .json(responseMessage("Internal Server error", null, "fail", null));
  }
};

const getDistricts = async (req, res) => {
  try {
    const provinceCode = req.params.provinceCode;
    const connection = mysql.createPool(config);
    const sqlQuery = `CALL sp_get_district_list(?)`;
    connection.query(
      sqlQuery,
      [provinceCode],
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
            .json(responseMessage("Districts not found", null, "fail", null));
        }
        return res
          .status(200)
          .json(responseMessage("Districts", userData, "success", null));
      }
    );
  } catch (err) {
    return res
      .status(500)
      .json(responseMessage("Internal Server error", null, "fail", null));
  }
};

const getWards = async (req, res) => {
  try {
    const districtCode = req.params.districtCode;
    const connection = mysql.createPool(config);
    const sqlQuery = `CALL sp_get_ward_list(?)`;
    connection.query(
      sqlQuery,
      [districtCode],
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
            .json(responseMessage("Wards not found", null, "fail", null));
        }
        return res
          .status(200)
          .json(responseMessage("Wards", userData, "success", null));
      }
    );
  } catch (err) {
    return res
      .status(500)
      .json(responseMessage("Internal Server error", null, "fail", null));
  }
};

module.exports = {
  creatProperty,
  getListProperty,
  getUserInterest,
  getListUserInterest,
  updateProperty,
  getDetailProperty,
  getListPropertyByUser,
  insertInterest,
  removeInterest,
  getProvinces,
  getDistricts,
  getWards,
};
