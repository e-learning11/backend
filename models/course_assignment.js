const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection").sequelize;

const CourseAssignment = sequelize.define("CourseAssignment", {
  text: {
    type: DataTypes.TEXT("long"),
    allowNull: false,
    validate: {
      notNull: {
        msg: "please enter answer for the assignment",
      },
    },
  },
  grade: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});

module.exports = CourseAssignment;
