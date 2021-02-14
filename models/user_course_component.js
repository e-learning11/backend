const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection").sequelize;

const UserCourseComponent = sequelize.define("UserCourseComponent", {
  isDone: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

module.exports = UserCourseComponent;
