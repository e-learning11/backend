const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection").sequelize;

const Course = sequelize.define("Course", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  summary: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  decription: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  language: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  image: {
    type: DataTypes.BLOB,
    allowNull: true,
  },
});

module.exports = Course;
