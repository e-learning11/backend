const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection").sequelize;

const CourseEssay = sequelize.define("CourseEssay", {
  text: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "please enter answer for the essay",
      },
    },
  },
  grade: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  testId: {
    type: DataTypes.INTEGER,
  },
  isGraded: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

module.exports = CourseEssay;
