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
  isDone: {
    type: DataTypes.BOOLEAN,
  },
});

module.exports = UserTestGrade;
