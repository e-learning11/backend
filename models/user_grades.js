const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection").sequelize;

const UserTestGrade = sequelize.define("UserTestGrade", {
  grade: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  testId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  lastTimeSubmit: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  state: {
    type: DataTypes.INTEGER,
  },
});

module.exports = UserTestGrade;
