const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection").sequelize;

const CourseURL = sequelize.define("CourseURL", {
  url: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      fields: ["url"],
      msg: "the url is already in use",
      args: true,
    },
    validate: {
      notNull: {
        msg: "please enter url",
      },
    },
  },
});

module.exports = CourseURL;
