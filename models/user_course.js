const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection").sequelize;

const UserCourse = sequelize.define("UserCourse", {
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = UserCourse;
