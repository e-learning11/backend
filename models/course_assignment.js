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

  isGraded: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  file: {
    type: DataTypes.BLOB("long"),
  },
  contentType: {
    type: DataTypes.TEXT,
  },
});

module.exports = CourseAssignment;
