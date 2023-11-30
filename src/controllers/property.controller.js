const mysql = require("mysql2/promise");
const config = require("../config/database.config.js");
const responseMessage = require("../helpers/responseMessage.js");

const creatProperty = async (req, res) => {
  try {
    const userId = req.user.data.userID;
    const {
      propertyName,
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
    const connection = await mysql.createConnection(config);

    const [result] = await connection.query(
      `CALL sp_insert_property(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        propertyName,
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
      ]
    );

    const data = result.slice(0, -1).flat();
    const propertyId = data[0].property_id;
    // console.log(propertyId);
    await connection.query(`CALL sp_insert_property_images(?, ?)`, [
      propertyId,
      JSON.stringify(imageUrls),
    ]);
    connection.end();
    return res
      .status(200)
      .json(responseMessage("Property created", null, "success", null));
  } catch (err) {
    return res
      .status(500)
      .json(responseMessage("Internal Server error", null, "fail", null));
  }
};

const getListProperty = async (req, res) => {
  try {
    const pageNumber = req.query.pageNumber;
    const pageSize = 12;

    const connection = await mysql.createConnection(config);

    const [result] = await connection.query(`CALL sp_get_list_property(?, ?)`, [
      pageNumber,
      pageSize,
    ]);
    connection.end();
    const properties = result.slice(0, -1).flat();

    if (!properties || properties.length === 0) {
      return res
        .status(404)
        .json(responseMessage("Property not found", null, "fail", null));
    }

    return res
      .status(200)
      .json(responseMessage("Properties found", properties, "success", null));
  } catch (err) {
    return res
      .status(500)
      .json(responseMessage("Internal Server error", null, "fail", null));
  }
};

const getUserInterest = async (req, res) => {
  try {
    const userId = req.user.data.userID;

    const connection = await mysql.createConnection(config);

    const [result] = await connection.execute(`CALL sp_get_interest_list(?)`, [
      userId,
    ]);
    connection.end();

    const userData = result.slice(0, -1).flat();

    if (!userData || userData.length === 0) {
      return res
        .status(404)
        .json(responseMessage("List not found", null, "fail", null));
    }

    return res
      .status(200)
      .json(responseMessage("User interest list", userData, "success", null));
  } catch (err) {
    return res
      .status(500)
      .json(responseMessage("Internal Server error", null, "fail", null));
  }
};

const getListUserInterest = async (req, res) => {
  try {
    const userId = req.user.data.userID;

    const connection = await mysql.createConnection(config);

    const [result] = await connection.query(
      `CALL sp_get_list_property_interest_by_user(?)`,
      [userId]
    );
    connection.end();
    const userData = result.slice(0, -1).flat();

    if (!userData || userData.length === 0) {
      return res
        .status(404)
        .json(responseMessage("List not found", null, "fail", null));
    }

    return res
      .status(200)
      .json(responseMessage("User interest list", userData, "success", null));
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
      propertyName,
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

    const connection = await mysql.createConnection(config);

    await connection.query(`CALL sp_update_property(?, ?, ...)`, [
      userId,
      propertyId,
      propertyName,
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
    ]);

    await connection.query(`CALL sp_update_property_images(?, ?)`, [
      propertyId,
      JSON.stringify(imageUrls),
    ]);

    return res
      .status(200)
      .json(responseMessage("Property updated", null, "success", null));
  } catch (err) {
    return res
      .status(500)
      .json(responseMessage("Internal Server error", null, "fail", null));
  }
};

const getListPropertybyCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const pageNumber = req.query.pageNumber;
    const pageSize = 12;

    const connection = await mysql.createConnection(config);

    const [result] = await connection.query(
      `CALL sp_get_property_by_catagory(?, ?, ?)`,
      [category, pageNumber, pageSize]
    );
    connection.end();
    const properties = result.slice(0, -1).flat();

    if (!properties || properties.length === 0) {
      return res
        .status(404)
        .json(responseMessage("Property not found", null, "fail", null));
    }

    return res
      .status(200)
      .json(responseMessage("Properties found", properties, "success", null));
  } catch (err) {
    return res
      .status(500)
      .json(responseMessage("Internal Server error", null, "fail", null));
  }
};

const getListPropertyByUser = async (req, res) => {
  try {
    const userId = req.user.data.userID;

    const connection = await mysql.createConnection(config);

    const [result] = await connection.query(
      `CALL sp_get_list_property_by_user(?)`,
      [userId]
    );
    connection.end();
    const userData = result.slice(0, -1).flat();

    if (!userData || userData.length === 0) {
      return res
        .status(404)
        .json(responseMessage("List not found", null, "fail", null));
    }

    return res
      .status(200)
      .json(responseMessage("User properties", userData, "success", null));
  } catch (err) {
    return res
      .status(500)
      .json(responseMessage("Internal Server error", null, "fail", null));
  }
};

const getDetailProperty = async (req, res) => {
  try {
    const propertyId = req.params.propertyId;

    const connection = await mysql.createConnection(config);

    const [result] = await connection.query(`CALL sp_get_detail_property(?)`, [
      propertyId,
    ]);
    connection.end();
    const propertyData = result.slice(0, -1).flat();

    if (!propertyData || propertyData.length === 0) {
      return res
        .status(404)
        .json(responseMessage("Property not found", null, "fail", null));
    }

    return res
      .status(200)
      .json(responseMessage("Property detail", propertyData, "success", null));
  } catch (err) {
    return res
      .status(500)
      .json(responseMessage("Internal Server error", null, "fail", null));
  }
};

const updateStatusProperty = async (req, res) => {
  try {
    const propertyId = req.body.propertyId;
    const status = req.body.status;

    const connection = await mysql.createConnection(config);

    await connection.query(`CALL sp_update_status_property(?, ?)`, [
      propertyId,
      status,
    ]);

    return res
      .status(200)
      .json(responseMessage("Update status property", null, "success", null));
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

    const connection = await mysql.createConnection(config);

    await connection.query(`CALL sp_insert_interest(?, ?)`, [
      userId,
      propertyId,
    ]);
    connection.end();
    return res
      .status(200)
      .json(responseMessage("Insert interest", null, "success", null));
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
    const connection = await mysql.createConnection(config);
    const sqlQuery = `CALL sp_remove_interest(?, ?)`;
    await connection.query(sqlQuery, [userId, propertyId]);
    connection.end();
    return res
      .status(200)
      .json(responseMessage("Remove interest", null, "success", null));
  } catch (err) {
    return res
      .status(500)
      .json(responseMessage("Internal Server error", null, "fail", null));
  }
};

const getProvinces = async (req, res) => {
  try {
    const connection = await mysql.createConnection(config);

    const [result] = await connection.query(`CALL sp_get_province_list()`);
    connection.end();
    const provinces = result.slice(0, -1).flat();

    if (!provinces || provinces.length === 0) {
      return res
        .status(404)
        .json(responseMessage("Provinces not found", null, "fail", null));
    }

    return res
      .status(200)
      .json(responseMessage("Provinces", provinces, "success", null));
  } catch (err) {
    return res
      .status(500)
      .json(responseMessage("Internal Server error", null, "fail", null));
  }
};

const getDistricts = async (req, res) => {
  try {
    const provinceCode = req.params.provinceCode;
    const connection = await mysql.createConnection(config);
    const sqlQuery = `CALL sp_get_district_list(?)`;
    const [result] = await connection.query(sqlQuery, [provinceCode]);
    connection.end();
    const data = result.slice(0, -1).flat();
    if (!data || data.length == 0) {
      // User not found
      return res
        .status(404)
        .json(responseMessage("Districts not found", null, "fail", null));
    }
    return res
      .status(200)
      .json(responseMessage("Districts", data, "success", null));
  } catch (err) {
    return res
      .status(500)
      .json(responseMessage("Internal Server error", null, "fail", null));
  }
};

const getWards = async (req, res) => {
  try {
    const districtCode = req.params.districtCode;
    const connection = await mysql.createConnection(config);
    const sqlQuery = `CALL sp_get_ward_list(?)`;
    const [result] = await connection.query(sqlQuery, [districtCode]);
    connection.end();
    const data = result.slice(0, -1).flat();
    if (!data || data.length == 0) {
      // User not found
      return res
        .status(404)
        .json(responseMessage("Wards not found", null, "fail", null));
    }
    return res
      .status(200)
      .json(responseMessage("Wards", data, "success", null));
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
  getListPropertybyCategory,
  getDetailProperty,
  updateStatusProperty,
  getListPropertyByUser,
  insertInterest,
  removeInterest,
  getProvinces,
  getDistricts,
  getWards,
};
