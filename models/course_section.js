const { DataTypes } = require("sequelize");

const sequelize = require("../database/connection").sequelize;

const CourseSection = sequelize.define("CourseSection", {
  name: {
    type: DataTypes.TEXT("long"),
    allowNull: false,
    validate: {
      notNull: {
        msg: "please enter name for the course section",
      },
    },
  },
  start: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: "please enter start for the course section",
      },
    },
  },
  end: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: "please enter end for the course section",
      },
    },
  },
});

module.exports = CourseSection;
