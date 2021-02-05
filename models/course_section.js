const { DataTypes } = require("sequelize");

const sequelize = require("../database/connection").sequelize;

const CourseSection = sequelize.define("CourseSection", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  start: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  end: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = CourseSection;
