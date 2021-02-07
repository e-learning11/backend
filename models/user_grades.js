const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection").sequelize;

const UserTestGrade = sequelize.define("UserTestGrade", {
  grade: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  testId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

module.exports = UserTestGrade;
