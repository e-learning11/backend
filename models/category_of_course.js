const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection").sequelize;

const CategoryOfCourse = sequelize.define("CategoryOfCourse", {});

module.exports = CategoryOfCourse;
