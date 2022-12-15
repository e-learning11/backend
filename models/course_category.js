const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection").sequelize;

const CourseCategory = sequelize.define("CourseCategory", {
  name: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = CourseCategory;