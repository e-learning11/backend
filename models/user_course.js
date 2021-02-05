const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection").sequelize;

const UserCourse = sequelize.define("UserCourse", {
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  currentComponent: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

module.exports = UserCourse;
